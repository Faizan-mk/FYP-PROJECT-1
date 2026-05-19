const { TransportCompany, TransportRoute } = require('./model/pakTransportIndex');
const sequelize = require('./config/db');

async function check() {
    try {
        await sequelize.authenticate();
        const route = await TransportRoute.findByPk(1, {
            include: [{ model: TransportCompany, as: 'company' }]
        });
        if (route) {
            process.stdout.write('---RESULTS_START---\n');
            process.stdout.write('URL:' + route.real_redirect_url + '\n');
            process.stdout.write('WEB:' + route.company?.website + '\n');
            process.stdout.write('---RESULTS_END---\n');
        }
    } catch (e) { } finally {
        await sequelize.close();
    }
}
check();
