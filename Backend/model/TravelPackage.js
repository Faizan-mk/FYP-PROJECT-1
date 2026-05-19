const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TravelPackage = sequelize.define(
    'TravelPackage',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        agency_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        destination_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        destination_key: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        package_type: {
            type: DataTypes.ENUM('solo', 'group', 'family'),
            allowNull: false,
        },
        group_size: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        base_price_pkr: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        booking_url_override: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'travel_packages',
        timestamps: true,
    }
);

module.exports = TravelPackage;
