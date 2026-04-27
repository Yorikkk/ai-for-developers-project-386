# Project Coding Rules (Non-Obvious Only)

- Storage has two create methods: `create()` (auto-generates ID) and `createWithId()` (manual ID for init data)
- Slots are NOT stored - they're generated on-the-fly in `backend/src/utils/slot-generator.ts`
- Timezone is hardcoded as **UTC+3** in slot-generator.ts (ISO format: `+03:00`)
- Working hours are constants: `WORK_START_HOUR = 10`, `WORK_END_HOUR = 18` (hardcoded, not configurable)
- Default owner/guest IDs are constants in slot-generator.ts: `owner-1`, `guest-scenario-1`
- Init data uses predefined IDs (`event-type-1`, `event-type-2`, etc.) via `createWithId()` method
- Data is auto-initialized on each server start via `initializeData()` in `backend/src/app.ts`
- Frontend must be run from `/frontend` directory (`cd frontend && npm run dev`), not root