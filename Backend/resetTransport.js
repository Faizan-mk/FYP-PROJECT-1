// One-time reset script — run with: node resetTransport.js
require('dotenv').config();
const { TransportCompany, TransportRoute, TransportClick } = require('./model/pakTransportIndex');
const sequelize = require('./config/db');

async function reset() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB connected');

        // Drop in correct order (routes depend on companies FK)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.query('DROP TABLE IF EXISTS transport_routes');
        await sequelize.query('DROP TABLE IF EXISTS transport_companies');
        await sequelize.query('DROP TABLE IF EXISTS transport_clicks');
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Old tables dropped');

        // Recreate
        await TransportCompany.sync({ force: true });
        await TransportRoute.sync({ force: true });
        await TransportClick.sync({ force: true });
        console.log('✅ Tables recreated with new schema & associations');
        console.log('👉 Now restart backend — seed will run automatically!');
    } catch (e) {
        console.error('❌ Error:', e.message);
    } finally {
        await sequelize.close();
    }
}
reset();
