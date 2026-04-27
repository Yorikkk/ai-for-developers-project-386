# Project Debug Rules (Non-Obvious Only)

- Backend uses **in-memory storage** - all data is lost on server restart
- Data reinitializes automatically on each server start (see `initializeData()` in app.ts)
- Slots are generated dynamically, not stored - check `slot-generator.ts` for logic bugs
- Nodemon watches ONLY `/backend/src` directory - changes outside won't trigger restart
- Frontend and backend run on separate ports: Vite 5173 (frontend), Express 3000 (backend)
- Error responses follow `ErrorResponse` model with `code` and `message` fields
- No authentication - if endpoints return 401/403, the implementation is wrong