const { TransportCompany, TransportRoute } = require('./model/pakTransportIndex');
const sequelize = require('./config/db');

async function check() {
    try {
        await sequelize.authenticate();
        const route = await TransportRoute.findByPk(1, {
            include: [{ model: TransportCompany, as: 'company' }]
        });
        if (route) {
            console.log('--- ROUTE 1 ---');
            console.log('Real Redirect URL:', route.real_redirect_url);
            console.log('Company Website:', route.company?.website);
        } else {
            console.log('Route 1 not found');
        }
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await sequelize.close();
    }
}
check();
