import { Request, Response } from 'express';
import { bookingStorage } from '../storage';
import { CreateBookingRequest, ErrorResponse } from '../models';
import { isValidDateTime, isValidDate } from '../utils/date-utils';

/**
 * Create a new booking
 * POST /bookings
 */
export function createBooking(req: Request, res: Response): void {
  try {
    const data: CreateBookingRequest = req.body;

    // Validation
    if (!data.dateTime || !isValidDateTime(data.dateTime)) {
      const error: ErrorResponse = {
        code: 'VALIDATION_ERROR',
        message: 'Valid dateTime is required (ISO 8601 format)',
      };
      res.status(400).json(error);
      return;
    }

    if (!data.eventTypeId || typeof data.eventTypeId !== 'string') {
      const error: ErrorResponse = {
        code: 'VALIDATION_ERROR',
        message: 'Event type ID is required',
      };
      res.status(400).json(error);
      return;
    }

    if (!data.ownerId || typeof data.ownerId !== 'string') {
      const error: ErrorResponse = {
        code: 'VALIDATION_ERROR',
        message: 'Owner ID is required',
      };
      res.status(400).json(error);
      return;
    }

    if (!data.guestScenarioId || typeof data.guestScenarioId !== 'string') {
      const error: ErrorResponse = {
        code: 'VALIDATION_ERROR',
        message: 'Guest scenario ID is required',
      };
      res.status(400).json(error);
      return;
    }

    const booking = bookingStorage.create(data);
    res.status(200).json(booking);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      code: 'INTERNAL_ERROR',
      message: 'Failed to create booking',
    };
    res.status(500).json(errorResponse);
  }
}

/**
 * Get list of bookings with optional filtering by date
 * GET /bookings?date=YYYY-MM-DD
 */
export function listBookings(req: Request, res: Response): void {
  try {
    const { date } = req.query;

    let bookings;
    if (date && typeof date === 'string') {
      if (!isValidDate(date)) {
        const error: ErrorResponse = {
          code: 'VALIDATION_ERROR',
          message: 'Invalid date format. Use YYYY-MM-DD',
        };
        res.status(400).json(error);
        return;
      }
      bookings = bookingStorage.findByDate(date);
    } else {
      bookings = bookingStorage.findAll();
    }

    res.status(200).json(bookings);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      code: 'INTERNAL_ERROR',
      message: 'Failed to list bookings',
    };
    res.status(500).json(errorResponse);
  }
}
