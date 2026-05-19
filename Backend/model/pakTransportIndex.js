const TransportCompany = require('./TransportCompany');
const TransportRoute = require('./TransportRoute');
const TransportClick = require('./TransportClick');

// Associations
TransportCompany.hasMany(TransportRoute, { foreignKey: 'company_id', onDelete: 'CASCADE' });
TransportRoute.belongsTo(TransportCompany, { foreignKey: 'company_id', as: 'company' });

TransportRoute.hasMany(TransportClick, { foreignKey: 'route_id', onDelete: 'CASCADE' });
TransportClick.belongsTo(TransportRoute, { foreignKey: 'route_id' });

module.exports = { TransportCompany, TransportRoute, TransportClick };
