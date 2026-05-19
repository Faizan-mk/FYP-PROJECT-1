const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TransportCompany = sequelize.define('TransportCompany', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    logo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING(10),   // 'bus' | 'train' | 'car'
        allowNull: false,
        defaultValue: 'bus',
    },
    website: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'transport_companies',
    timestamps: true,
});

module.exports = TransportCompany;
