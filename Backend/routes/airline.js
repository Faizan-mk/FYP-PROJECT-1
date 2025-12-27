const express = require('express');
const router = express.Router();
const airlineController = require('../controller/airlineController');
const { adminMiddleware } = require('../middleware/authMiddleware');

// Public routes (all users can view)
router.get('/', airlineController.getAllAirlines);
router.get('/:id', airlineController.getAirlineById);

// Admin-only routes
router.post('/', adminMiddleware, airlineController.createAirline);
router.put('/:id', adminMiddleware, airlineController.updateAirline);
router.delete('/:id', adminMiddleware, airlineController.deleteAirline);

module.exports = router;
