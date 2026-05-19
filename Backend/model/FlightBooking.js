const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FlightBooking = sequelize.define('FlightBooking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    flightId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    airline: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    airlineName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departure: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    arrival: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departureDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    arrivalDate: {
        type: DataTypes.STRING,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'PKR',
    },
    passengerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    passengerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    passengerPhone: {
        type: DataTypes.STRING,
    },
    numberOfPassengers: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    bookingReference: {
        type: DataTypes.STRING,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'confirmed',
    },
    bookingUrl: {
        type: DataTypes.TEXT,
    },
    // Additional airline data
    flightNumber: {
        type: DataTypes.STRING,
    },
    aircraft: {
        type: DataTypes.STRING,
    },
    cabinClass: {
        type: DataTypes.STRING,
    },
    baggageAllowance: {
        type: DataTypes.STRING,
    },
    numberOfStops: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    terminal: {
        type: DataTypes.STRING,
    },
    gate: {
        type: DataTypes.STRING,
    },
    seatNumber: {
        type: DataTypes.STRING,
    },
    amenities: {
        type: DataTypes.TEXT, // JSON string
    },
    country: {
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.FLOAT,
    },
    cancellationReason: {
        type: DataTypes.TEXT,
    },
    cancelledAt: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true,
});

module.exports = FlightBooking;

