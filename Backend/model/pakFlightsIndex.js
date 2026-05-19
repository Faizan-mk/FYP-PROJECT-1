const PakAirline = require('./PakAirline');
const PakFlight = require('./PakFlight');
const FlightClick = require('./FlightClick');

// Associations
PakAirline.hasMany(PakFlight, { foreignKey: 'airline_id', onDelete: 'CASCADE' });
PakFlight.belongsTo(PakAirline, { foreignKey: 'airline_id', as: 'airline' });

PakFlight.hasMany(FlightClick, { foreignKey: 'flight_id', onDelete: 'CASCADE' });
FlightClick.belongsTo(PakFlight, { foreignKey: 'flight_id' });

module.exports = { PakAirline, PakFlight, FlightClick };
