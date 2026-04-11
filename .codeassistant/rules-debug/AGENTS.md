# Project Debug Rules (Non-Obvious Only)

- Frontend dev server runs on Vite default port (5173) - check terminal output for exact URL
- TypeSpec compilation errors appear in terminal when running `npx tsp compile .` from root
- No backend server yet - API endpoints are defined but not implemented
- Generated OpenAPI file at `generated/openapi.json` can be inspected for API contract
- Browser dev tools show React components with Mantine styling via Emotion
- Console logs from frontend appear in browser dev tools, not terminal
- Hot reload works for frontend changes when dev server is running
- If frontend fails to start, ensure you're in `frontend` directory before running `npm run dev`