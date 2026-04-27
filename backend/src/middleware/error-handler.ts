import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../models';

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  const errorResponse: ErrorResponse = {
    code: 'INTERNAL_ERROR',
    message: err.message || 'Internal server error',
  };

  res.status(500).json(errorResponse);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  const errorResponse: ErrorResponse = {
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  };
  res.status(404).json(errorResponse);
}
