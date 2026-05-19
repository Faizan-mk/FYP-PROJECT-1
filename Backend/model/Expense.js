const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'Misc',
    },
    type: {
        type: DataTypes.ENUM('credit', 'debit'),
        defaultValue: 'debit',
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    UserId: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = Expense;
