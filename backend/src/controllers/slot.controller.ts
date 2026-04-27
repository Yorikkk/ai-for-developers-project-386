import { Request, Response } from 'express';
import { eventTypeStorage, bookingStorage } from '../storage';
import { ErrorResponse } from '../models';
import { generateSlotsWithAvailability } from '../utils/slot-generator';
import { isValidDate } from '../utils/date-utils';

/**
 * Get list of slots for a specific event type and date
 * GET /slots?eventTypeId=xxx&date=YYYY-MM-DD
 */
export function listSlots(req: Request, res: Response): void {
  try {
    const { eventTypeId, date } = req.query;

    // Validate required parameters
    if (!eventTypeId || typeof eventTypeId !== 'string') {
      const errorResponse: ErrorResponse = {
        code: 'INVALID_REQUEST',
        message: 'eventTypeId parameter is required',
      };
      res.status(400).json(errorResponse);
      return;
    }

    if (!date || typeof date !== 'string') {
      const errorResponse: ErrorResponse = {
        code: 'INVALID_REQUEST',
        message: 'date parameter is required (format: YYYY-MM-DD)',
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Validate date format
    if (!isValidDate(date)) {
      const errorResponse: ErrorResponse = {
        code: 'INVALID_REQUEST',
        message: 'Invalid date format. Expected: YYYY-MM-DD',
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Get event type
    const eventType = eventTypeStorage.findById(eventTypeId);
    if (!eventType) {
      const errorResponse: ErrorResponse = {
        code: 'NOT_FOUND',
        message: `Event type with id ${eventTypeId} not found`,
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Get all bookings for this date (all event types)
    const bookings = bookingStorage.findByDate(date);

    // Get all event types to determine booking durations
    const allEventTypes = eventTypeStorage.findAll();

    // Generate slots with availability information
    const slots = generateSlotsWithAvailability(eventType, date, bookings, allEventTypes);

    res.status(200).json(slots);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      code: 'INTERNAL_ERROR',
      message: 'Failed to generate slots',
    };
    res.status(500).json(errorResponse);
  }
}
