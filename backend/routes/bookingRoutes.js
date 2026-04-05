import express from 'express';
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  getBookingById,
  cancelBooking,
  getPropertyBookings,
} from '../controllers/bookingController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/host', protect, getHostBookings);
router.get('/property/:propertyId', getPropertyBookings); // public
router.get('/:id', protect, getBookingById);
router.delete('/:id', protect, cancelBooking);

export default router;