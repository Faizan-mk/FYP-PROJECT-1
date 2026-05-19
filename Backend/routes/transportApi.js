const express = require('express');
const router = express.Router();
const transportApiController = require('../controller/transportApiController');

router.get('/live', transportApiController.getRealTimeData);

module.exports = router;
