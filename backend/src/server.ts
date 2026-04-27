import { createApp } from './app';

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║   Booking API Server is running!            ║
║   Port: ${PORT}                                 ║
║   Environment: ${process.env.NODE_ENV || 'development'}                  ║
║                                              ║
║   API Endpoints:                             ║
║   - GET    /event-types                      ║
║   - POST   /event-types                      ║
║   - GET    /event-types/:id                  ║
║   - GET    /slots?eventTypeId=xxx            ║
║   - GET    /bookings?date=YYYY-MM-DD         ║
║   - POST   /bookings                         ║
╚══════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});
