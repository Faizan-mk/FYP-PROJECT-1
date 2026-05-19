const express = require('express');
const router = express.Router();
const { getAllAirlines, searchFlights, redirectFlight } = require('../controller/pakFlightsController');

// GET /api/pak-airlines  →  get all Pakistan airlines
router.get('/', getAllAirlines);

module.exports = router;
