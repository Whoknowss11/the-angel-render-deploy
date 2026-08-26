import { createDecipheriv } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";

const MAGIC = Buffer.from("ANGELZ01", "ascii");
const root = process.cwd();
const appDirectory = resolve(root, "app");
const temporaryArchive = resolve(root, ".angelz-deploy.zip");
const npmCommand = process.platform === "win32" ? process.execPath : "npm";
const npmPrefix = process.platform === "win32"
  ? [resolve(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js")]
  : [];

function run(command, args, options = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolveRun();
      else reject(new Error(`${command} exited with ${code ?? signal}.`));
    });
  });
}

const keyText = process.env.DEPLOY_ARCHIVE_KEY;
if (!keyText) throw new Error("DEPLOY_ARCHIVE_KEY is required.");
const key = Buffer.from(keyText, "base64url");
if (key.byteLength !== 32) throw new Error("DEPLOY_ARCHIVE_KEY has an invalid length.");

const payload = await readFile(resolve(root, "payload.enc"));
if (payload.byteLength < MAGIC.byteLength + 12 + 16
  || !payload.subarray(0, MAGIC.byteLength).equals(MAGIC)) {
  throw new Error("Encrypted deployment payload has an invalid header.");
}
const nonceStart = MAGIC.byteLength;
const tagStart = nonceStart + 12;
const ciphertextStart = tagStart + 16;
const decipher = createDecipheriv("aes-256-gcm", key, payload.subarray(nonceStart, tagStart));
decipher.setAAD(MAGIC);
decipher.setAuthTag(payload.subarray(tagStart, ciphertextStart));
const archive = Buffer.concat([decipher.update(payload.subarray(ciphertextStart)), decipher.final()]);

const buildEnvironment = { ...process.env };
for (const name of Object.keys(buildEnvironment)) {
  if (/(?:TOKEN|PASSWORD|SECRET|API_KEY|ARCHIVE_KEY)$/i.test(name)) delete buildEnvironment[name];
}

try {
  await rm(appDirectory, { recursive: true, force: true });
  await mkdir(appDirectory, { recursive: true });
  await writeFile(temporaryArchive, archive, { flag: "wx" });
  if (process.platform === "win32") {
    await run("tar", ["-xf", temporaryArchive, "-C", appDirectory], { cwd: root, env: buildEnvironment });
  } else {
    await run("unzip", ["-q", temporaryArchive, "-d", appDirectory], { cwd: root, env: buildEnvironment });
  }
  await run(npmCommand, [...npmPrefix, "ci", "--ignore-scripts"], { cwd: appDirectory, env: buildEnvironment });
  await run(npmCommand, [...npmPrefix, "run", "build"], { cwd: appDirectory, env: buildEnvironment });
  if (process.platform !== "win32") {
    const pythonLibraryDirectory = resolve(appDirectory, ".pythonlibs");
    await run("python3", [
      "-m", "pip", "install", "--disable-pip-version-check", "--no-cache-dir",
      "--upgrade", "--force-reinstall", "--target", pythonLibraryDirectory,
      "Pillow==12.3.0"
    ], { cwd: appDirectory, env: buildEnvironment });
    await run("python3", [
      "-c", "from PIL import Image, ImageDraw, ImageFont; print('Pillow runtime verified')"
    ], {
      cwd: appDirectory,
      env: { ...buildEnvironment, PYTHONPATH: pythonLibraryDirectory },
    });
  }
  console.log("Encrypted Angel Bot bundle verified and built.");
} finally {
  await rm(temporaryArchive, { force: true });
}
