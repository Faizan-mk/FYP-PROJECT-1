const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Safety = sequelize.define('Safety', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    police: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ambulance: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fire: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    embassyInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tips: {
        type: DataTypes.JSON, // Array of safety tips
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Safety;
