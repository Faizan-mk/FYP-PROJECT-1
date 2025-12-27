const sequelize = require('./config/db');
const { Flight, Hotel, Airline, Transport, Destination } = require('./model/index');

const cleanDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected. Cleaning tables...');

        await Flight.destroy({ where: {}, truncate: { cascade: true } });
        console.log('Flights cleared.');

        await Hotel.destroy({ where: {}, truncate: { cascade: true } });
        console.log('Hotels cleared.');

        await Airline.destroy({ where: {}, truncate: { cascade: true } });
        console.log('Airlines cleared.');

        await Transport.destroy({ where: {}, truncate: { cascade: true } });
        console.log('Transport cleared.');

        await Destination.destroy({ where: {}, truncate: { cascade: true } });
        console.log('Destinations cleared.');

        console.log('Database cleaned successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error cleaning database:', err);
        process.exit(1);
    }
};

cleanDatabase();
