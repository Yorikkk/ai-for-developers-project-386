# Project Architecture Rules (Non-Obvious Only)

- Two separate systems: TypeSpec API definition (root) and React frontend (`frontend/`)
- No backend implementation yet - only API contract defined in TypeSpec
- Frontend is standalone demo app showing UI components, not integrated with API
- TypeSpec generates OpenAPI 3.0 specification automatically to `generated/openapi.json`
- Entity relationships: Slot references EventType, Owner, and GuestScenario; Booking references same
- Designed as simplified booking system (inspired by Cal.com) with 30-minute meeting slots
- No user authentication system - all endpoints are public by design
- Frontend uses Mantine component library with Emotion CSS-in-JS for styling
- Prism.js integration is for code display only, not for syntax highlighting user input
- Project follows Hexlet educational project structure with separate frontend directory