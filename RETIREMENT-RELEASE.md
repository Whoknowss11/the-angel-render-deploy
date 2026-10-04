# Retire the old recruitment tracker

Owner-approved removal of the old prospect lists, follow-up tracking, reports, reminders and retired backlog metrics. Registration, welcomes, manager profiles, regional lead directories, goals, campaigns and the verified backup transport remain unchanged.

The authenticated private overlay includes an idempotent, transaction-protected removal of the five old recruitment-tracker tables' contents. Old controls acknowledge privately without accessing tracker data. Standby does not perform removal. Existing backup and recovery protections remain enabled.

Deploy only with a controlled login-disabled standby/final-backup/single-writer handover. Do not restore a stale database or start the Canadian runtime. The original database is preserved privately before removal; no database, credentials or plain private application source is in this repository.
