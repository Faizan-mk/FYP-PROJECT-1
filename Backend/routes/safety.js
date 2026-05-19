const express = require('express');
const router = express.Router();
const safetyController = require('../controller/safetyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, safetyController.getSafetyData);
router.post('/', authMiddleware, safetyController.addSafetyData);

module.exports = router;
