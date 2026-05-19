const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PakAirline = sequelize.define('PakAirline', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    logo: {
        type: DataTypes.STRING(10),
        defaultValue: '✈️'
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ''
    }
}, {
    tableName: 'pak_airlines',
    timestamps: true
});

module.exports = PakAirline;
