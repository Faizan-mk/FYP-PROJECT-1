const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();

// Import models to ensure they are registered with Sequelize
const { User, Trip, Destination, Chat, Flight, Hotel, Airline, Transport } = require('./model/index');

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());

// Define Routes
console.log('Loading auth routes...');
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/trips', require('./routes/trip'));
app.use('/api/v1/destinations', require('./routes/destination'));
app.use('/api/v1/chat', require('./routes/chat'));
app.use('/api/v1/flights', require('./routes/flight'));
app.use('/api/v1/hotels', require('./routes/hotel'));
app.use('/api/v1/airlines', require('./routes/airline'));
app.use('/api/v1/transport', require('./routes/transport'));
console.log('Routes loaded.');

// Health check
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

const seedDestinations = async () => {
    const count = await Destination.count();
    if (count === 0) {
        const SAMPLE_DESTINATIONS = [
            { name: 'Hunza Valley', type: 'Mountain', weather: '15°C • Cool', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Skardu', type: 'Mountain', weather: '12°C • Cold', image: 'https://images.unsplash.com/photo-1591557637031-27f9a1c4f12b?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Naran Kaghan', type: 'Mountain', weather: '18°C • Pleasant', image: 'https://images.unsplash.com/photo-1597248881519-db089d3744e0?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Swat Valley', type: 'Mountain', weather: '20°C • Mild', image: 'https://images.unsplash.com/photo-1601758260944-92b84b9e2a6e?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Gwadar Beach', type: 'Beach', weather: '28°C • Sunny', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168a3c8?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Karachi Seaview', type: 'Beach', weather: '30°C • Humid', image: 'https://images.unsplash.com/photo-1590496793134-97e76c9fbd01?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Lahore (Old City)', type: 'Culture', weather: '26°C • Warm', image: 'https://images.unsplash.com/photo-1597215843389-512a99e95cfc?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Islamabad', type: 'City', weather: '24°C • Clear', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Thar Desert', type: 'Desert', weather: '34°C • Dry', image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Fairy Meadows', type: 'Adventure', weather: '14°C • Chilly', image: 'https://images.unsplash.com/photo-1612423284934-2850a4ea4b25?q=80&w=1200&auto=format&fit=crop' },
        ];
        await Destination.bulkCreate(SAMPLE_DESTINATIONS);
        console.log('Destinations seeded successfully!');
    }
};

const seedFlights = async () => {
    const { Flight } = require('./model');
    const count = await Flight.count();
    if (count === 0) {
        const SAMPLE_FLIGHTS = [
            { airline: 'Emirates', price: 120000, duration: '2h 15m', departure: '10:00 AM', arrival: '12:15 PM', from: 'KHI', to: 'DXB', bookingUrl: 'https://www.emirates.com' },
            { airline: 'Qatar Airways', price: 135000, duration: '3h 30m', departure: '02:00 PM', arrival: '05:30 PM', from: 'LHE', to: 'DOH', bookingUrl: 'https://www.qatarairways.com' },
            { airline: 'PIA', price: 45000, duration: '1h 45m', departure: '08:00 AM', arrival: '09:45 AM', from: 'ISB', to: 'KHI', bookingUrl: 'https://www.piac.com.pk' },
        ];
        await Flight.bulkCreate(SAMPLE_FLIGHTS);
        console.log('Flights seeded successfully!');
    }
};

const seedHotels = async () => {
    const { Hotel } = require('./model');
    const count = await Hotel.count();
    if (count === 0) {
        const SAMPLE_HOTELS = [
            { name: 'Pearl Continental', price: 25000, stars: 5, rating: 4.5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200', bookingUrl: 'https://www.pchotels.com' },
            { name: 'Serena Hotel', price: 35000, stars: 5, rating: 4.8, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200', bookingUrl: 'https://www.serenahotels.com' },
            { name: 'Movenpick', price: 20000, stars: 4, rating: 4.2, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200', bookingUrl: 'https://www.movenpick.com' },
        ];
        await Hotel.bulkCreate(SAMPLE_HOTELS);
        console.log('Hotels seeded successfully!');
    }
};

const seedAirlines = async () => {
    const { Airline } = require('./model');
    const count = await Airline.count();
    if (count === 0) {
        const SAMPLE_AIRLINES = [
            { name: 'Emirates', logo: '✈️', description: 'Leading airline from UAE', country: 'United Arab Emirates', rating: 4.8, websiteUrl: 'https://www.emirates.com' },
            { name: 'Qatar Airways', logo: '✈️', description: 'Award-winning airline from Qatar', country: 'Qatar', rating: 4.9, websiteUrl: 'https://www.qatarairways.com' },
            { name: 'PIA', logo: '✈️', description: 'Pakistan International Airlines', country: 'Pakistan', rating: 3.8, websiteUrl: 'https://www.piac.com.pk' },
            { name: 'Turkish Airlines', logo: '✈️', description: 'Flag carrier of Turkey', country: 'Turkey', rating: 4.5, websiteUrl: 'https://www.turkishairlines.com' },
            { name: 'Etihad Airways', logo: '✈️', description: 'Premium airline from Abu Dhabi', country: 'United Arab Emirates', rating: 4.6, websiteUrl: 'https://www.etihad.com' },
        ];
        await Airline.bulkCreate(SAMPLE_AIRLINES);
        console.log('Airlines seeded successfully!');
    }
};


const seedTransport = async () => {
    const { Transport } = require('./model');
    const count = await Transport.count();
    if (count === 0) {
        const SAMPLE_TRANSPORT = [
            { type: 'Bus', provider: 'Daewoo Express', price: 2500, duration: '5h 30m', rating: 4.5, from: 'Lahore', to: 'Islamabad', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200', bookingUrl: 'https://daewoo.com.pk' },
            { type: 'Train', provider: 'Green Line Express', price: 4500, duration: '18h 00m', rating: 4.2, from: 'Karachi', to: 'Islamabad', image: 'https://images.unsplash.com/photo-1474487024220-316279fcc963?q=80&w=1200', bookingUrl: 'https://pakrail.gov.pk' },
            { type: 'Car Rental', provider: 'Traveler Choice', price: 6000, duration: 'Daily', rating: 4.0, from: 'All Cities', to: 'All Cities', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200', bookingUrl: 'https://www.booking.com/cars' },
        ];
        await Transport.bulkCreate(SAMPLE_TRANSPORT);
        console.log('Transport seeded successfully!');
    }
};


// Connect to Database and Sync
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        // Sync database and then seed data
        try {
            await sequelize.sync({ alter: true });

            console.log('Database synced successfully.');

            // Seed sample data if tables are empty (Commented out to allow purely admin-entered data)
            /*
            await seedDestinations();
            await seedFlights();
            await seedHotels();
            await seedAirlines();
            await seedTransport();
            */
        } catch (syncErr) {
            console.error('Database initialization failed:', syncErr);
        }

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

startServer();
