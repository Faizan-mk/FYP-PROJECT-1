const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Hotel = sequelize.define('Hotel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
    },
    images: {
        type: DataTypes.JSON, // Array of image URLs
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 4.0,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    breakfast: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    wifi: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    stars: {
        type: DataTypes.INTEGER,
        defaultValue: 4,
    },
    bookingUrl: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

module.exports = Hotel;
