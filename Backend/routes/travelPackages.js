const express = require('express');
const { listPackages } = require('../controller/travelPackageController');

const router = express.Router();

router.get('/', listPackages);

module.exports = router;
