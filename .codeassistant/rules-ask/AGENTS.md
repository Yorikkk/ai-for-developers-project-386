# Project Documentation Rules (Non-Obvious Only)

- Project description is in Russian in `README.md` but codebase uses English
- Domain entities are defined in Russian in original `AGENTS.md` but TypeSpec uses English field names
- `Process.md` documents the project creation workflow in Russian
- API design follows Cal.com simplified booking system (no authentication, no external calendar integrations)
- Frontend is demonstration-only - shows Mantine components and Prism.js but no real API integration yet
- TypeSpec entities map to domain entities: Owner, EventType, Slot, Booking, GuestScenario
- Generated OpenAPI at `generated/openapi.json` is the source of truth for API contract
- Design mockups in `design/` directory show expected UI flow