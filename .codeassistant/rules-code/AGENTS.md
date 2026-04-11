# Project Coding Rules (Non-Obvious Only)

- Frontend must be run from `/frontend` directory, not root (`cd frontend && npm run dev`)
- TypeSpec compilation generates OpenAPI to `generated/openapi.json` (overwrites each time)
- Mantine component props use shorthand spacing (e.g., `mt="sm"` for margin-top, not CSS classes)
- Prism.js code highlighting is already configured in `App.tsx` - don't add duplicate imports
- No authentication system - all API endpoints are public (simplified booking system)
- TypeScript strict mode is enabled via `tsconfig.app.json` - ensure proper null checks
- Import order: external libraries first (`@mantine/*`, `react`), then local imports
- Build command includes TypeScript compilation (`tsc -b && vite build`) - runs both steps