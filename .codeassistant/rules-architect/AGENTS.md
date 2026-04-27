# Project Architecture Rules (Non-Obvious Only)

- Three separate systems: TypeSpec spec (root), Express backend (`backend/`), React frontend (`frontend/`)
- Backend uses in-memory storage pattern - NOT a database (data resets on restart)
- Slots are computed resources, not stored entities - generated in `slot-generator.ts` based on working hours
- Storage layer has dual creation pattern: `create()` for runtime, `createWithId()` for init data
- Data initialization happens in `app.ts` on server start (not in storage constructors)
- Slot generation tightly coupled to hardcoded constants (WORK_START_HOUR, WORK_END_HOUR, UTC+3)
- No authentication by design - adding auth would require rethinking public endpoints
- Error handling uses custom middleware pattern with `ErrorResponse` model