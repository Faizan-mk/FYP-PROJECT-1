const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TransportBooking = sequelize.define('TransportBooking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'confirmed'
    },
    bookingReference: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passengerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bookingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = TransportBooking;
