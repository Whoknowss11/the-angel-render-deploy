# Changes-only cloud backup release

Owner approved building, testing and deploying this update on October 4, 2026. Render remains the sole live bot; Canadian host stays stopped.

Only app source changed: src/cloud-persistence.ts. Uses the last verified full snapshot as the basis for compressed XOR differences every five minutes, only when smaller. Each receiver request reconstructs and persists a complete raw SQLite snapshot with target SHA-256 and read-back verification. No stored delta chains. First upload, hourly checkpoint and graceful shutdown use full gzip; failures retry the same target as full once. No dependency, roster, role or database schema changes.

Requires the compatible v2 backup transport, deployed as version 7acb1560-ac61-469d-9f99-8109570193e6. Legacy full/raw uploads remain supported. Existing archive retention and free plans are unchanged.

Encrypted app patch SHA-256: 8e5016ff1c5ac2ff3a6455b803dc45a2d0999d6fe0b45a87ccc14803f9203009.
Encrypted backup-services recovery SHA-256: 0ee50f06f3a93d681943b5b2233855c55dc2e134e944915c1a87dbe2ee55aa29.
Uploader source SHA-256: 2180e32da73c04f64ce71bbc688f774e866cc6f55d0c22eb8864717edb69ab81.

Packages use the existing encryption key. No readable private source, databases or secrets are published. A successful build is not proof of a production deployment; consult the private handoff and live receipts. Rollback or restart requires a controlled single-writer handover preserving the latest remote database.
