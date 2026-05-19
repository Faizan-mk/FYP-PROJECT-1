const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PakFlight = sequelize.define('PakFlight', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    airline_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    from_airport: {
        type: DataTypes.STRING,
        allowNull: false
    },
    to_airport: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departure_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    arrival_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stops: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    real_redirect_url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'pak_flights',
    timestamps: true
});

module.exports = PakFlight;
