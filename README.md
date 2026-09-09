# The Angel — Render deployment wrapper

This repository contains the deployment wrapper for The Angel Discord bot.

The application bundle is authenticated and encrypted with AES-256-GCM. The readable bot source, Discord credentials, Cloudflare credentials, and live database are not stored in this repository. Render receives the decryption key separately as a protected environment variable.

The existing service uses `DISCORD_LOGIN_ENABLED=true`. Startup restores the verified cloud snapshot before opening the database or logging in to Discord. Required restore failures stop startup; never package a replacement production database.

## Recovery release — 2026-09-09

Narrow repair of the deployed August 28 application: preserve owner-managed manager labels and regions, deactivate the offboarded manager without deleting creator history, ignore deleted roles in registration permissions, acknowledge commands before background role maintenance, preserve monthly goal figures, and accurately report built-in coaching fallback. Nine focused recovery tests and the TypeScript build passed locally. Other unfinished feature work is not included.

Auto-deploy remains off. Activate only after the old Discord worker has stopped and uploaded its final verified snapshot, so two writers never race. This release does not change billing or prevent Free-plan idle suspension.

