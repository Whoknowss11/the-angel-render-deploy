# Backup transport release — October 3, 2026

Owner-approved, narrow update of the verified deployed baseline 60c8152c6463604929a7497272236743d34532e7. Only src/cloud-persistence.ts changes within the authenticated encrypted recovery overlay. Original large payload, manager/routing code, welcome code, campaigns and dependencies are unchanged. No database or credentials are included.

Uploads use gzip only for the explicitly configured compatible Cloudflare receiver and verify its persisted read-back receipt. Legacy URL remains raw-compatible. Restore continues receiving the verified raw SQLite format. The receiver forwards to the existing latest-backup store; independent retained history is separate.

Deploy through standby first, verify old worker termination and final cloud snapshot, then activate the same tested commit. Never run competing writers or upload the stopped Canadian database. Keep auto-deploy off and the Free instance unchanged.
