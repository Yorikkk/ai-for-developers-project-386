import { Router } from 'express';
import { createBooking, listBookings } from '../controllers';

const router = Router();

// POST /bookings - Create a new booking
router.post('/', createBooking);

// GET /bookings?date=YYYY-MM-DD - Get list of bookings with optional filtering
router.get('/', listBookings);

export default router;
