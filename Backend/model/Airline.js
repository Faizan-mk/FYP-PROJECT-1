const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Airline = sequelize.define('Airline', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING,
        defaultValue: '✈️',
    },
    description: {
        type: DataTypes.TEXT,
    },
    websiteUrl: {
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 4.0,
    },
    country: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

module.exports = Airline;
