const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TransportClick = sequelize.define('TransportClick', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    route_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'transport_routes',
            key: 'id',
        },
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'transport_clicks',
    timestamps: true,
    updatedAt: false,
});

module.exports = TransportClick;
