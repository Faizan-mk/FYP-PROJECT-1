const express = require('express');
const router = express.Router();
const ctrl = require('../controller/hotelApiController');

// GET /api/hotels-live — live hotel feed with real-time pricing
router.get('/', ctrl.getLiveHotels);

// GET /api/hotels-live/:id — single hotel live data
router.get('/:id', ctrl.getLiveHotelById);

module.exports = router;
