# Encrypted backup-service recovery bundle

`backup-services.enc` contains the independent Cloudflare archive and compatibility receiver source, pinned dependency lockfile, configuration, tests and recovery scripts. It excludes databases, environment exports, credentials and dependency caches. The existing app code, scripts and 18 bundled PDF/image/font assets remain in `payload.enc` with the authenticated `recovery-patch.enc` overlay.

Format: eight ASCII bytes ANGELZB1, 12-byte random nonce, 16-byte AES-256-GCM tag, then ciphertext. AAD is the eight-byte header. Reuse the existing protected deployment archive key; decrypted bytes are gzip JSON, format angelz-backup-recovery-v1, with a `files` map containing relative-path base64 file contents. Authenticate before decompressing; extract only safe relative paths into a new isolated directory. Do not display or publish the key. Credentials remain protected provider secrets and need separate authorized recovery.

This is a code/assets recovery reference, not proof of current data freshness. Operational history is authenticated Cloudflare storage; select and verify an isolated database copy before any approved production restore. Never upload the stopped Canadian database or launch a second writer. This documentation-only commit need not be deployed to Render.
