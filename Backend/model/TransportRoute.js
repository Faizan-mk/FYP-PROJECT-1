const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TransportRoute = sequelize.define('TransportRoute', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'transport_companies',
            key: 'id',
        },
    },
    from_city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    to_city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departure_time: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    arrival_time: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    seat_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Standard',
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    seats_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 44,
    },
    seats_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 44,
    },
    real_redirect_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'transport_routes',
    timestamps: true,
});

module.exports = TransportRoute;
