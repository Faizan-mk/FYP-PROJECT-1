const express = require('express');
const router = express.Router();
const flightBookingController = require('../controller/flightBookingController');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/v1/flight-bookings
router.post('/', auth, flightBookingController.createFlightBooking);

// @route   GET /api/v1/flight-bookings/user/:userId (MUST come before /:id)
router.get('/user/:userId', auth, flightBookingController.getUserBookings);

// @route   DELETE /api/v1/flight-bookings/user/:userId/clear (MUST come before /:id)
router.delete('/user/:userId/clear', auth, flightBookingController.deleteAllUserBookings);

// @route   PUT /api/v1/flight-bookings/:id/cancel (specific route, comes before /:id)
router.put('/:id/cancel', auth, flightBookingController.cancelBooking);

// @route   GET /api/v1/flight-bookings/:id (generic route, comes after specific ones)
router.get('/:id', auth, flightBookingController.getBookingById);

// @route   DELETE /api/v1/flight-bookings/:id (generic route, comes after specific ones)
router.delete('/:id', auth, flightBookingController.deleteBooking);

module.exports = router;
