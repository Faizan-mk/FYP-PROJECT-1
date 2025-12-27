const express = require('express');
const router = express.Router();
const hotelController = require('../controller/hotelController');
const { adminMiddleware } = require('../middleware/authMiddleware');

// Public routes (all users can view)
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);

// Admin-only routes
router.post('/', adminMiddleware, hotelController.createHotel);
router.put('/:id', adminMiddleware, hotelController.updateHotel);
router.delete('/:id', adminMiddleware, hotelController.deleteHotel);

module.exports = router;
