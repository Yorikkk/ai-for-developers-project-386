import { Request, Response } from 'express';
import { eventTypeStorage } from '../storage';
import { CreateEventTypeRequest, ErrorResponse } from '../models';

/**
 * Create a new event type
 * POST /event-types
 */
export function createEventType(req: Request, res: Response): void {
  try {
    const data: CreateEventTypeRequest = req.body;

    // Validation
    if (!data.title || typeof data.title !== 'string') {
      const error: ErrorResponse = {
        code: 'VALIDATION_ERROR',
        message: 'Title is required and must be a string',
      };
      res.status(400).json(error);
      return;
    }

    if (!data.durationMinutes || typeof data.durationMinutes !== 'number' || data.durationMinutes <= 0) {
      const error: ErrorResponse = {
        code: 'VALIDATION_ERROR',
        message: 'Duration minutes must be a positive number',
      };
      res.status(400).json(error);
      return;
    }

    const eventType = eventTypeStorage.create(data);
    res.status(200).json(eventType);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      code: 'INTERNAL_ERROR',
      message: 'Failed to create event type',
    };
    res.status(500).json(errorResponse);
  }
}

/**
 * Get event type by ID
 * GET /event-types/:eventTypeId
 */
export function getEventTypeById(req: Request, res: Response): void {
  try {
    const { eventTypeId } = req.params;

    const eventType = eventTypeStorage.findById(eventTypeId);
    if (!eventType) {
      const error: ErrorResponse = {
        code: 'NOT_FOUND',
        message: `Event type with ID ${eventTypeId} not found`,
      };
      res.status(404).json(error);
      return;
    }

    res.status(200).json(eventType);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      code: 'INTERNAL_ERROR',
      message: 'Failed to get event type',
    };
    res.status(500).json(errorResponse);
  }
}

/**
 * Get list of all event types
 * GET /event-types
 */
export function listEventTypes(req: Request, res: Response): void {
  try {
    const eventTypes = eventTypeStorage.findAll();
    res.status(200).json(eventTypes);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      code: 'INTERNAL_ERROR',
      message: 'Failed to list event types',
    };
    res.status(500).json(errorResponse);
  }
}
