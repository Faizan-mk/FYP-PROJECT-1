const express = require('express');
const router = express.Router();
const transportBookingController = require('../controller/transportBookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user/:userId', authMiddleware, transportBookingController.getUserBookings);
router.post('/', authMiddleware, transportBookingController.createBooking);
router.put('/:id/cancel', authMiddleware, transportBookingController.cancelBooking);
router.delete('/:id', authMiddleware, transportBookingController.deleteBooking);

module.exports = router;
