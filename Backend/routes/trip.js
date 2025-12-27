const express = require('express');
const router = express.Router();
const tripController = require('../controller/tripController');
const authMiddleware = require('../middleware/authMiddleware');

// All trip routes are protected
router.use(authMiddleware);

router.post('/', tripController.createTrip);
router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
