const express = require('express');
const router = express.Router();
const destinationController = require('../controller/destinationController');

router.get('/', destinationController.getAllDestinations);
router.post('/', destinationController.createDestination);
router.put('/:id', destinationController.updateDestination);
router.delete('/:id', destinationController.deleteDestination);

module.exports = router;
