const express = require('express');
const router = express.Router();
const transportController = require('../controller/transportController');
const { adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', transportController.getAllTransport);
router.get('/:id', transportController.getTransportById);

// Admin routes
router.post('/', adminMiddleware, transportController.createTransport);
router.put('/:id', adminMiddleware, transportController.updateTransport);
router.delete('/:id', adminMiddleware, transportController.deleteTransport);

module.exports = router;
