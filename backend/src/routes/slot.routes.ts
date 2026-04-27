import { Router } from 'express';
import { listSlots } from '../controllers';

const router = Router();

// GET /slots?eventTypeId=xxx - Get list of slots with optional filtering
router.get('/', listSlots);

export default router;
