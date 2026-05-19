const User = require('./User');
const Trip = require('./Trip');
const Destination = require('./Destination');
const Chat = require('./Chat');
const Flight = require('./Flight');
const Hotel = require('./Hotel');

const Transport = require('./Transport');
const Notification = require('./Notification');
const Safety = require('./Safety');
const Expense = require('./Expense');
const Estimation = require('./Estimation');
const FlightBooking = require('./FlightBooking');
const TransportBooking = require('./TransportBooking');

// Define associations
User.hasMany(Trip, { onDelete: 'CASCADE' });
Trip.belongsTo(User);

User.hasMany(Chat, { foreignKey: 'userId', onDelete: 'CASCADE' });
Chat.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Expense, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Expense.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(Estimation, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Estimation.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(FlightBooking, { foreignKey: 'userId', onDelete: 'CASCADE' });
FlightBooking.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(TransportBooking, { foreignKey: 'userId', onDelete: 'CASCADE' });
TransportBooking.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Trip,
    Destination,
    Chat,
    Flight,
    Hotel,

    Transport,
    Notification,
    Safety,
    Expense,
    Estimation,
    FlightBooking,
    TransportBooking,
};

