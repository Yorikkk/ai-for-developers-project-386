import express, { Application } from 'express';
import cors from 'cors';
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

  // Initialize data storage with predefined data
  initializeData();

  // API Routes
  app.use('/', routes);

  // 404 handler (must be after all routes)
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
