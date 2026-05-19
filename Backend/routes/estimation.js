const express = require('express');
const router = express.Router();
const {
    saveEstimation,
    getEstimations,
    deleteEstimation
} = require('../controller/estimationController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/v1/estimation
// @desc    Save a new cost estimation
// @access  Private
router.post('/', auth, saveEstimation);

// @route   GET api/v1/estimations
// @desc    Get all user estimations
// @access  Private
router.get('/', auth, getEstimations);

// @route   DELETE api/v1/estimations/:id
// @desc    Delete an estimation
// @access  Private
router.delete('/:id', auth, deleteEstimation);

module.exports = router;
