const TravelAgency = require('./TravelAgency');
const TravelPackage = require('./TravelPackage');

TravelAgency.hasMany(TravelPackage, { foreignKey: 'agency_id', onDelete: 'CASCADE' });
TravelPackage.belongsTo(TravelAgency, { foreignKey: 'agency_id' });

module.exports = { TravelAgency, TravelPackage };
