# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Key Commands (Non-Obvious)
- Run frontend: `cd frontend && npm run dev` OR `make frontend-dev` (from root)
- Run backend: `cd backend && npm run dev` OR `make backend-dev` (from root)
- TypeSpec compilation: `npx tsp compile .` (must run from root, generates to `generated/openapi.json`)

## Critical Architecture Patterns
- Backend uses **in-memory storage** - all data is lost on server restart
- Data is auto-initialized via `initializeData()` in `backend/src/storage/init-data.ts` on each server start
- Slots are **generated dynamically** (not stored) based on `eventType.durationMinutes` and working hours
- Timezone is hardcoded as **UTC+3 (Moscow)** in `backend/src/utils/slot-generator.ts`
- Working hours hardcoded: **10:00-18:00** in `slot-generator.ts` (WORK_START_HOUR, WORK_END_HOUR)

## Storage Patterns (Backend)
- Storage has two create methods: `create()` (auto-generates ID) and `createWithId()` (manual ID for init data)
- Storage returns all entities via `findAll()` and single entity via `findById(id)`
- Predefined IDs used in init data: `owner-1`, `owner-2`, `guest-scenario-1`, `guest-scenario-2`, `event-type-1`, `event-type-2`

## Gotchas
- Frontend and backend run on separate ports (Vite default 5173, Express default 3000)
- Backend nodemon watches only `/backend/src` directory for changes
- No tests configured - test scripts are placeholders
