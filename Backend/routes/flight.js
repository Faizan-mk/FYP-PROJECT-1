const express = require('express');
const router = express.Router();
const flightController = require('../controller/flightController');
const { adminMiddleware } = require('../middleware/authMiddleware');

// Public routes (all users can view)
router.get('/', flightController.getAllFlights);
router.get('/search', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);

// Admin-only routes
router.post('/', adminMiddleware, flightController.createFlight);
router.put('/:id', adminMiddleware, flightController.updateFlight);
router.delete('/:id', adminMiddleware, flightController.deleteFlight);

module.exports = router;
