import { Router } from 'express';
import { createEventType, getEventTypeById, listEventTypes } from '../controllers';

const router = Router();

// POST /event-types - Create a new event type
router.post('/', createEventType);

// GET /event-types - Get list of all event types (must be before /:eventTypeId)
router.get('/', listEventTypes);

// GET /event-types/:eventTypeId - Get event type by ID
router.get('/:eventTypeId', getEventTypeById);

export default router;
