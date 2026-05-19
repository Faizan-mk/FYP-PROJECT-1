const Expense = require('../model/Expense');
const { createNotification } = require('./notificationController');

exports.createExpense = async (req, res) => {
    try {
        const { title, amount, category, type, date } = req.body;
        const expense = await Expense.create({
            title,
            amount,
            category,
            type,
            date,
            UserId: req.user.id
        });

        if (type === 'debit' && amount > 10000) {
            await createNotification(
                req.user.id,
                'Budget',
                '💸',
                'High expense logged',
                `You logged PKR ${Number(amount).toLocaleString()} for ${title}.`
            );
        }

        res.status(201).json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { UserId: req.user.id },
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            where: { id: req.params.id, UserId: req.user.id }
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await expense.destroy();
        res.json({ message: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getExpenseStats = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { UserId: req.user.id }
        });

        const totalSpent = expenses
            .filter(e => e.type === 'debit')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const totalReceived = expenses
            .filter(e => e.type === 'credit')
            .reduce((acc, curr) => acc + curr.amount, 0);

        res.json({
            totalSpent,
            totalReceived,
            balance: totalReceived - totalSpent,
            count: expenses.length
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
