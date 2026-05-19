const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FlightClick = sequelize.define('FlightClick', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ip_address: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    user_agent: {
        type: DataTypes.TEXT,
        defaultValue: ''
    }
}, {
    tableName: 'flight_clicks',
    timestamps: true
});

module.exports = FlightClick;
