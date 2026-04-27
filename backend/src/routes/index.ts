import { Router } from 'express';
import eventTypeRoutes from './event-type.routes';
import slotRoutes from './slot.routes';
import bookingRoutes from './booking.routes';

const router = Router();

// Register all routes
router.use('/event-types', eventTypeRoutes);
router.use('/slots', slotRoutes);
router.use('/bookings', bookingRoutes);

export default router;
