const express = require('express');
const router = express.Router();
const flightApiController = require('../controller/flightApiController');

// @route   GET /api/v1/flight-api/search
// @desc    Search real flights from Amadeus API
// @access  Public
router.get('/search', flightApiController.searchRealFlights);

// @route   GET /api/v1/flight-api/deals
// @desc    Get current flight deals and promotions
// @access  Public
router.get('/deals', flightApiController.getFlightDeals);

module.exports = router;
