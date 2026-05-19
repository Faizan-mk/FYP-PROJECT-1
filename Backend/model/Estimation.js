const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Estimation = sequelize.define('Estimation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    travelers: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    transportType: {
        type: DataTypes.STRING,
        defaultValue: 'standard',
    },
    accommodationType: {
        type: DataTypes.STRING,
        defaultValue: 'standard',
    },
    dailyAllowance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalEstimate: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    breakdown: {
        type: DataTypes.JSON, // Stores detailed calculation
    },
    UserId: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = Estimation;
