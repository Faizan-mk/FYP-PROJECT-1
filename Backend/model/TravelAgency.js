const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TravelAgency = sequelize.define(
    'TravelAgency',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(16),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        website_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'travel_agencies',
        timestamps: true,
    }
);

module.exports = TravelAgency;
