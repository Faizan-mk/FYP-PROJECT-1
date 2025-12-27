const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    budget: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    travelers: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    tripType: {
        type: DataTypes.STRING,
        defaultValue: 'vacation',
    },
    status: {
        type: DataTypes.ENUM('planned', 'ongoing', 'completed'),
        defaultValue: 'planned',
    },
}, {
    timestamps: true,
});

module.exports = Trip;
