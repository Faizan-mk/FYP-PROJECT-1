const express = require('express');
const router = express.Router();
const { searchFlights, redirectFlight } = require('../controller/pakFlightsController');

// GET /api/pak-flights/search
router.get('/search', searchFlights);

// GET /api/pak-flights/redirect/:id
router.get('/redirect/:id', redirectFlight);

module.exports = router;
