# Project Documentation Rules (Non-Obvious Only)

- Backend is FULLY implemented - don't assume it's missing (old docs were outdated)
- Slots are generated dynamically, not fetched from storage (counterintuitive for REST API)
- Storage uses in-memory arrays - NOT a database (all data resets on server restart)
- Init data in `backend/src/storage/init-data.ts` uses hardcoded IDs like `owner-1`, `event-type-1`
- Slot generation logic in `backend/src/utils/slot-generator.ts` has hardcoded working hours and timezone
- Plans in `/plans` directory describe backend architecture - they're implementation docs, not designs