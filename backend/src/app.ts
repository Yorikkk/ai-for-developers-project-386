import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errorHandler, notFoundHandler, logger } from './middleware';
import { initializeData } from './storage';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app: Application = express();

  // Middleware
  app.use(cors()); // Enable CORS for all origins (can be configured for specific origins)
  app.use(express.json()); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.use(logger); // Log all requests

  // Serve static files from public directory (для production с Docker)
  const publicPath = path.join(__dirname, '../public');
  app.use(express.static(publicPath));

  // Initialize data storage with predefined data
  initializeData();

  // API Routes
  app.use('/', routes);

  // SPA fallback - serve index.html for any GET requests that didn't match API routes
  // This allows React Router to handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  // 404 handler (should not be reached due to SPA fallback for GET requests)
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
