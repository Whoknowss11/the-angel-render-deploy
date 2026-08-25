# The Angel — Render deployment wrapper

This repository contains the deployment wrapper for The Angel Discord bot.

The application bundle is authenticated and encrypted with AES-256-GCM. The readable bot source, Discord credentials, Cloudflare credentials, and live database are not stored in this repository. Render receives the decryption key separately as a protected environment variable.

The service starts in standby mode. It must pass `/healthz` and restore the verified Cloudflare snapshot before Discord login is enabled.
