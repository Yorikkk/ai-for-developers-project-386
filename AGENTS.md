# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure
- **Root**: TypeSpec API specification (`main.tsp`) - generates OpenAPI to `generated/openapi.json`
- **Frontend**: React/TypeScript app in `/frontend` directory - must be run from that directory

## Key Commands (Non-Obvious)
- Run frontend dev server: `cd frontend && npm run dev` (not from root)
- Generate OpenAPI from TypeSpec: `npx tsp compile .` (from root)
- Build frontend: `cd frontend && npm run build` (includes TypeScript compilation)

## Architecture Notes
- API defined in TypeSpec with entities: Owner, EventType, Slot, Booking, GuestScenario
- Frontend uses Mantine UI components with Emotion styling
- Prism.js for code highlighting (already configured in App.tsx)
- No authentication or user accounts (simplified booking system)

## Code Style
- Frontend uses ESLint with TypeScript/React hooks rules
- Mantine component props use shorthand (e.g., `mt="sm"` for margin-top)
- Import order: external libraries first, then local imports
- TypeScript strict mode enabled via tsconfig.app.json

## Gotchas
- Frontend dev server runs on different port than API (no backend yet)
- TypeSpec compilation must run from root directory
- Generated OpenAPI file overwritten on each compilation
- No test suite configured yet - test script is placeholder