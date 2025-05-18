import { Router } from 'express';
import {
  createBooking,
  releaseBooking,
  listBookings
} from '../controllers/booking.controller';
import { verifyAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  CreateBookingDTO,
  ReleaseBookingDTO,
  ListBookingsDTO
} from '../dtos/booking.dto';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// All booking actions require auth
router.use(verifyAuth);

// Create a booking
router.post(
  '/',
  validateRequest(CreateBookingDTO),
  roleMiddleware("USER"),
  createBooking
);

// Release (user’s own or admin)
router.put(
  '/release',
  validateRequest(ReleaseBookingDTO),
  roleMiddleware("ADMIN"),
  releaseBooking
);

// List bookings, with pagination & status filter
router.get(
  '/',
  validateRequest(ListBookingsDTO, 'query'),
  listBookings
);

export default router;
