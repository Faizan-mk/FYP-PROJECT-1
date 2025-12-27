const User = require('./User');
const Trip = require('./Trip');
const Destination = require('./Destination');
const Chat = require('./Chat');
const Flight = require('./Flight');
const Hotel = require('./Hotel');
const Airline = require('./Airline');
const Transport = require('./Transport');

// Define associations
User.hasMany(Trip, { onDelete: 'CASCADE' });
Trip.belongsTo(User);

User.hasMany(Chat, { foreignKey: 'userId', onDelete: 'CASCADE' });
Chat.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Trip,
    Destination,
    Chat,
    Flight,
    Hotel,
    Airline,
    Transport,
};
