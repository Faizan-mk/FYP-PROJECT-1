const express = require('express');
const router = express.Router();
const {
    createExpense,
    getExpenses,
    deleteExpense,
    getExpenseStats
} = require('../controller/expenseController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/v1/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', auth, createExpense);

// @route   GET api/v1/expenses
// @desc    Get all user expenses
// @access  Private
router.get('/', auth, getExpenses);

// @route   GET api/v1/expenses/stats
// @desc    Get expense statistics
// @access  Private
router.get('/stats', auth, getExpenseStats);

// @route   DELETE api/v1/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, deleteExpense);

module.exports = router;
