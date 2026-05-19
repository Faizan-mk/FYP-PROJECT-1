const express = require('express');
const router = express.Router();
const destinationController = require('../controller/destinationController');
const auth = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/authMiddleware');

router.get('/popular', destinationController.getPopularDestinations);
router.get('/for-you', destinationController.getForYouDestinations);
router.get('/suggestions', destinationController.getDestinationSuggestions);
router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);
router.post('/', adminMiddleware, destinationController.createDestination);
router.put('/:id', adminMiddleware, destinationController.updateDestination);
router.delete('/:id', adminMiddleware, destinationController.deleteDestination);

module.exports = router;
