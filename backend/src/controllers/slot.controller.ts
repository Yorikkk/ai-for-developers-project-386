import { Request, Response } from 'express';
import { slotStorage } from '../storage';
import { ErrorResponse } from '../models';

/**
 * Get list of slots with optional filtering by event type ID
 * GET /slots?eventTypeId=xxx
 */
export function listSlots(req: Request, res: Response): void {
  try {
    const { eventTypeId } = req.query;

    let slots;
    if (eventTypeId && typeof eventTypeId === 'string') {
      slots = slotStorage.findByEventTypeId(eventTypeId);
    } else {
      slots = slotStorage.findAll();
    }

    res.status(200).json(slots);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      code: 'INTERNAL_ERROR',
      message: 'Failed to list slots',
    };
    res.status(500).json(errorResponse);
  }
}
