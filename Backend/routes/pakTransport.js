const express = require('express');
const router = express.Router();
const ctrl = require('../controller/pakTransportController');

// GET /api/transport/companies — all active companies with live route count
router.get('/companies', ctrl.getCompanies);

// GET /api/transport/search?companyCode=DX&from=Lahore&to=Islamabad&date=2026-02-22&passengers=1
router.get('/search', ctrl.searchRoutes);

// GET /api/transport/all-routes?from=Lahore&to=Islamabad&type=bus
router.get('/all-routes', ctrl.getAllRoutes);

module.exports = router;
