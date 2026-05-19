const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const { ensureGoogleAuthSchema } = require('./config/ensureGoogleAuthSchema');
const { ensurePasswordResetSchema } = require('./config/ensurePasswordResetSchema');
const { verifyMailConfig } = require('./utils/mailTransporter');
const { logFrontendUrlHint } = require('./utils/frontendUrl');
require('dotenv').config();

// Import models to ensure they are registered with Sequelize
const { User, Trip, Destination, Chat, Flight, Hotel, Transport, Expense, Estimation } = require('./model/index');
const ContactMessage = require('./model/ContactMessage');
require('./model/travelPackageIndex');

// Import new Pakistan Airlines flight models
const { PakAirline, PakFlight, FlightClick } = require('./model/pakFlightsIndex');

// Import new Pakistan Transport models
const { TransportCompany, TransportRoute, TransportClick } = require('./model/pakTransportIndex');


const app = express();

// Init Middleware (JWT is sent in headers, not cookies — keep CORS simple)
app.use(cors({ origin: true }));
app.use(express.json());

// Define Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/trips', require('./routes/trip'));
app.use('/api/v1/destinations', require('./routes/destination'));
app.use('/api/v1/chat', require('./routes/chat'));
app.use('/api/v1/flights', require('./routes/flight'));
app.use('/api/v1/hotels', require('./routes/hotel'));

// ─── NEW Live Hotel Feed ───────────────────────────────────────────────────────
app.use('/api/hotels-live', require('./routes/hotelApi'));
// ─────────────────────────────────────────────────────────────────────────────

// Legacy transport routes (kept for backward compat)
app.use('/api/v1/transport', require('./routes/transport'));
app.use('/api/v1/transport-api', require('./routes/transportApi'));
app.use('/api/v1/transport-bookings', require('./routes/transportBooking'));

// ─── NEW Pakistan Transport Module ───────────────────────────────────────────
app.use('/api/transport', require('./routes/pakTransport'));
// Redirect endpoint: logs click → redirects to real company URL
app.get('/api/redirect/transport/:id', require('./controller/pakTransportController').redirectToCompany);
// ─────────────────────────────────────────────────────────────────────────────
app.use('/api/v1/weather', require('./routes/weather'));
app.use('/api/v1/notifications', require('./routes/notification'));
app.use('/api/v1/users', require('./routes/user'));
app.use('/api/v1/safety', require('./routes/safety'));
app.use('/api/v1/contact', require('./routes/contact'));
app.use('/api/v1/expenses', require('./routes/expense'));
app.use('/api/v1/estimation', require('./routes/estimation'));
app.use('/api/v1/flight-api', require('./routes/flightApi'));
app.use('/api/v1/flight-bookings', require('./routes/flightBooking'));

// New Pakistan Airlines flight system
app.use('/api/pak-airlines', require('./routes/pakAirlines'));
app.use('/api/pak-flights', require('./routes/pakFlights'));

// ─── Live travel packages (tour agencies) ─────────────────────────────────────
app.use('/api/travel-packages', require('./routes/travelPackages'));
app.get('/api/redirect/travel-package/:id', require('./controller/travelPackageController').redirectToAgency);
// ─────────────────────────────────────────────────────────────────────────────

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
    const { PAK_HOTELS } = require('./data/pakHotelsSeed');
    const TARGET = PAK_HOTELS.length;
    try {
        const count = await Hotel.count();
        const isDev = process.env.NODE_ENV !== 'production';
        if (count === 0) {
            await Hotel.bulkCreate(PAK_HOTELS);
            console.log(`Hotels seeded successfully! (${PAK_HOTELS.length} Pakistan properties)`);
        } else if (isDev && count < TARGET) {
            await Hotel.destroy({ where: {} });
            await Hotel.bulkCreate(PAK_HOTELS);
            console.log(`Hotels re-seeded for dev catalog (${PAK_HOTELS.length} Pakistan properties)`);
        }
    } catch (e) {
        console.warn('Hotel seed skipped:', e.message);
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

// ─── NEW Pakistan Transport Seed ─────────────────────────────────────────────
const seedPakTransport = async () => {
    // Fix ENUM → VARCHAR and add columns
    try {
        await sequelize.query("ALTER TABLE transport_companies MODIFY COLUMN type VARCHAR(10) NOT NULL DEFAULT 'bus'");
        await sequelize.query("ALTER TABLE transport_routes ADD COLUMN IF NOT EXISTS seats_total INT NOT NULL DEFAULT 44");
        await sequelize.query("ALTER TABLE transport_routes ADD COLUMN IF NOT EXISTS seats_available INT NOT NULL DEFAULT 44");
    } catch (e) { /* ignore errors if columns exist/dialect issues */ }

    // 1. Seed Companies if missing
    const companyCount = await TransportCompany.count();
    if (companyCount === 0) {
        const COMPANIES = [
            { name: 'Daewoo Express', code: 'DX', type: 'bus', logo: '🚌', website: 'https://daewoo.com.pk/', description: "Pakistan's No.1 premium intercity bus service with Wi-Fi, AC & reclining seats. Serving 50+ cities since 1997." },
            { name: 'Faisal Movers', code: 'FM', type: 'bus', logo: '🔵', website: 'https://faisalmovers.com/', description: "Pakistan's largest bus network. Connecting 80+ cities with affordable fares and comfortable coaches." },
            { name: 'Skyways', code: 'SW', type: 'bus', logo: '🟠', website: 'https://skyways.com.pk/', description: 'Budget-friendly intercity buses across Punjab, Sindh & KPK. Sleeper coaches available on select routes.' },
            { name: 'Bilal Travels', code: 'BT', type: 'bus', logo: '🟣', website: 'https://bilaltravels.com.pk/', description: 'Trusted bus service operating since 2005. VIP lounges at major terminals. Online & counter booking.' },
            { name: 'Pakistan Railways', code: 'PR', type: 'train', logo: '🚂', website: 'https://www.pakrail.gov.pk/', description: "Pakistan's national railway — connecting 500+ stations. AC Business, AC Sleeper & Economy classes available." },
            { name: 'Careem Intercity', code: 'CR', type: 'car', logo: '🚗', website: 'https://www.careem.com/en-pk/', description: 'Book private intercity rides with Careem. GPS-tracked, insured drivers. Multiple car options — Careem GO, Business & MAX.' },
            { name: 'inDrive Intercity', code: 'ID', type: 'car', logo: '🟤', website: 'https://indrive.com/en-pk/city-to-city/', description: 'Set your own fare! inDrive lets passengers propose a price for intercity rides. Negotiate directly with drivers.' },
            { name: 'Metro Cab', code: 'MC', type: 'car', logo: '🟡', website: 'https://metrocab.com.pk/', description: 'Professional chauffeur-driven intercity cabs. Sedan, SUV & luxury car options. Fixed rates, no surge pricing.' },
        ];
        await TransportCompany.bulkCreate(COMPANIES);
        console.log('✅ Pakistan Transport Companies seeded!');
    }

    // 2. Seed Routes if missing
    const routeCount = await TransportRoute.count();
    if (routeCount === 0) {
        const companies = await TransportCompany.findAll({ raw: true });
        const cm = {};
        companies.forEach(c => cm[c.code] = c.id);

        const ROUTES = [
            // DAEWOO EXPRESS
            { company_id: cm['DX'], from_city: 'Lahore', to_city: 'Islamabad', departure_time: '05:30', arrival_time: '10:30', duration: '5h 00m', seat_type: 'Business AC', price: 1650, seats_total: 28, seats_available: 18, real_redirect_url: 'https://daewoo.com.pk' },
            { company_id: cm['DX'], from_city: 'Lahore', to_city: 'Islamabad', departure_time: '08:00', arrival_time: '13:00', duration: '5h 00m', seat_type: 'Executive AC', price: 1950, seats_total: 14, seats_available: 6, real_redirect_url: 'https://daewoo.com.pk' },
            { company_id: cm['DX'], from_city: 'Lahore', to_city: 'Karachi', departure_time: '18:00', arrival_time: '06:00', duration: '12h 00m', seat_type: 'Business AC', price: 4800, seats_total: 28, seats_available: 12, real_redirect_url: 'https://daewoo.com.pk' },

            // FAISAL MOVERS
            { company_id: cm['FM'], from_city: 'Lahore', to_city: 'Islamabad', departure_time: '06:00', arrival_time: '11:00', duration: '5h 00m', seat_type: 'Standard AC', price: 950, seats_total: 50, seats_available: 42, real_redirect_url: 'https://faisalmovers.com/booking' },
            { company_id: cm['FM'], from_city: 'Lahore', to_city: 'Multan', departure_time: '07:00', arrival_time: '11:00', duration: '4h 00m', seat_type: 'Standard AC', price: 800, seats_total: 50, seats_available: 35, real_redirect_url: 'https://faisalmovers.com/booking' },

            // PAKISTAN RAILWAYS
            { company_id: cm['PR'], from_city: 'Karachi', to_city: 'Lahore', departure_time: '22:00', arrival_time: '20:00', duration: '22h 00m', seat_type: 'AC Lower', price: 6500, seats_total: 60, seats_available: 24, real_redirect_url: 'https://portal.pakrail.gov.pk' },
            { company_id: cm['PR'], from_city: 'Lahore', to_city: 'Islamabad', departure_time: '07:00', arrival_time: '11:30', duration: '4h 30m', seat_type: 'AC Seat', price: 2800, seats_total: 100, seats_available: 65, real_redirect_url: 'https://portal.pakrail.gov.pk' },

            // CAREEM
            { company_id: cm['CR'], from_city: 'Lahore', to_city: 'Islamabad', departure_time: 'On-Demand', arrival_time: '~3h later', duration: '~3h 00m', seat_type: 'Careem GO', price: 4800, seats_total: 4, seats_available: 4, real_redirect_url: 'https://www.careem.com/en-pk/intercity/' },

            // inDrive
            { company_id: cm['ID'], from_city: 'Lahore', to_city: 'Islamabad', departure_time: 'Flexible', arrival_time: '~3h later', duration: '~3h 00m', seat_type: 'Negotiable', price: 3800, seats_total: 4, seats_available: 4, real_redirect_url: 'https://indrive.com/pk/city-to-city' }
        ];

        await TransportRoute.bulkCreate(ROUTES);
        console.log(`✅ Pakistan Transport Routes seeded! (${ROUTES.length} routes)`);
    }
};
// ─────────────────────────────────────────────────────────────────────────────



const seedNotifications = async () => {
    const { Notification } = require('./model');
    const count = await Notification.count();
    // Only seed if we have at least one user to assign them to
    const user = await User.findOne();
    if (count === 0 && user) {
        const SAMPLE_NOTIFICATIONS = [
            { userId: user.id, type: 'Budget', icon: '💰', title: 'Budget limit nearing', message: "You've used 80% of your budget.", isRead: false },
            { userId: user.id, type: 'Weather', icon: '☔', title: 'Rain expected', message: 'Light showers tomorrow afternoon.', isRead: false },
            { userId: user.id, type: 'Flights', icon: '✈️', title: 'Gate change', message: 'Flight AF123 now departs from Gate B12.', isRead: true },
        ];
        await Notification.bulkCreate(SAMPLE_NOTIFICATIONS);
        console.log('Notifications seeded successfully!');
    }
};


const seedSafetyData = async () => {
    const { Safety } = require('./model');
    const count = await Safety.count();
    if (count === 0) {
        const SAMPLE_SAFETY = [
            {
                destination: 'Global',
                police: '911',
                ambulance: '911',
                fire: '911',
                embassyInfo: 'Contact your nearest embassy for assistance.',
                tips: [
                    'Always carry a copy of your passport.',
                    'Inform someone of your travel plans.',
                    'Keep emergency numbers saved in your phone.',
                    'Be aware of your surroundings.'
                ]
            },
            {
                destination: 'Pakistan',
                police: '15',
                ambulance: '1122',
                fire: '16',
                embassyInfo: 'Consular Assistance: US Embassy Islamabad: +92-51-201-4000',
                tips: [
                    'Use registered taxis only.',
                    'Avoid large public gatherings.',
                    'Drink bottled water only.',
                    'Respect local traditions and dress codes.'
                ]
            }
        ];
        await Safety.bulkCreate(SAMPLE_SAFETY);
        console.log('Safety data seeded successfully!');
    }
};

const seedAdmin = async () => {
    const bcrypt = require('bcryptjs');
    const { User } = require('./model');
    const adminEmail = 'admin@gmail.com';

    const adminExists = await User.findOne({ where: { email: adminEmail } });
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt); // Default password: admin

        await User.create({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        console.log('✅ Default Admin account created (admin@gmail.com)');
    }
};


// ─── Pakistan Airlines Seed ───────────────────────────────────────────────────
const seedPakAirlines = async () => {
    const count = await PakAirline.count();
    if (count === 0) {
        const AIRLINES = [
            { name: 'PIA – Pakistan International Airlines', code: 'PK', logo: '🟢', website: 'https://www.piac.com.pk', description: 'The national flag carrier of Pakistan, connecting major cities domestically and internationally.' },
            { name: 'Airblue', code: 'PA', logo: '🔵', website: 'https://www.airblue.com', description: 'Pakistan\'s first private airline, offering affordable fares across major cities.' },
            { name: 'SereneAir', code: 'ER', logo: '🟣', website: 'https://www.sereneair.com', description: 'A premium private airline with a focus on comfort and reliability.' },
            { name: 'AirSial', code: 'PF', logo: '🟡', website: 'https://www.airsial.com.pk', description: 'Sialkot-based airline expanding connectivity across Pakistan.' },
            { name: 'Fly Jinnah', code: 'FJ', logo: '🔴', website: 'https://www.flyjinnah.com', description: 'Pakistan\'s newest low-cost carrier, offering budget-friendly travel.' },
        ];
        await PakAirline.bulkCreate(AIRLINES);
        console.log('✅ Pakistan Airlines seeded!');
    }
};

const seedPakFlights = async () => {
    const count = await PakFlight.count();
    if (count === 0) {
        const airlines = await PakAirline.findAll({ raw: true });
        const airlineMap = {};
        airlines.forEach(a => airlineMap[a.code] = a.id);

        const FLIGHTS = [
            // PIA
            { airline_id: airlineMap['PK'], from_airport: 'Karachi (KHI)', to_airport: 'Lahore (LHE)', departure_time: '08:00', arrival_time: '09:10', duration: '1h 10m', stops: 0, price: 18000, real_redirect_url: 'https://www.piac.com.pk/booking' },
            { airline_id: airlineMap['PK'], from_airport: 'Karachi (KHI)', to_airport: 'Islamabad (ISB)', departure_time: '10:30', arrival_time: '12:00', duration: '1h 30m', stops: 0, price: 22000, real_redirect_url: 'https://www.piac.com.pk/booking' },
            { airline_id: airlineMap['PK'], from_airport: 'Lahore (LHE)', to_airport: 'Islamabad (ISB)', departure_time: '14:00', arrival_time: '14:55', duration: '0h 55m', stops: 0, price: 12000, real_redirect_url: 'https://www.piac.com.pk/booking' },
            { airline_id: airlineMap['PK'], from_airport: 'Islamabad (ISB)', to_airport: 'Peshawar (PEW)', departure_time: '07:00', arrival_time: '07:45', duration: '0h 45m', stops: 0, price: 10000, real_redirect_url: 'https://www.piac.com.pk/booking' },
            // Airblue
            { airline_id: airlineMap['PA'], from_airport: 'Karachi (KHI)', to_airport: 'Lahore (LHE)', departure_time: '09:15', arrival_time: '10:30', duration: '1h 15m', stops: 0, price: 16500, real_redirect_url: 'https://www.airblue.com/bookings' },
            { airline_id: airlineMap['PA'], from_airport: 'Karachi (KHI)', to_airport: 'Islamabad (ISB)', departure_time: '13:00', arrival_time: '14:25', duration: '1h 25m', stops: 0, price: 20000, real_redirect_url: 'https://www.airblue.com/bookings' },
            { airline_id: airlineMap['PA'], from_airport: 'Lahore (LHE)', to_airport: 'Karachi (KHI)', departure_time: '16:00', arrival_time: '17:20', duration: '1h 20m', stops: 0, price: 17000, real_redirect_url: 'https://www.airblue.com/bookings' },
            // SereneAir
            { airline_id: airlineMap['ER'], from_airport: 'Karachi (KHI)', to_airport: 'Islamabad (ISB)', departure_time: '11:30', arrival_time: '13:00', duration: '1h 30m', stops: 0, price: 24000, real_redirect_url: 'https://www.sereneair.com/booking' },
            { airline_id: airlineMap['ER'], from_airport: 'Lahore (LHE)', to_airport: 'Islamabad (ISB)', departure_time: '15:30', arrival_time: '16:25', duration: '0h 55m', stops: 0, price: 14000, real_redirect_url: 'https://www.sereneair.com/booking' },
            // AirSial
            { airline_id: airlineMap['PF'], from_airport: 'Sialkot (SKT)', to_airport: 'Karachi (KHI)', departure_time: '08:45', arrival_time: '10:15', duration: '1h 30m', stops: 0, price: 19000, real_redirect_url: 'https://www.airsial.com.pk/booking' },
            { airline_id: airlineMap['PF'], from_airport: 'Sialkot (SKT)', to_airport: 'Islamabad (ISB)', departure_time: '12:00', arrival_time: '12:50', duration: '0h 50m', stops: 0, price: 13000, real_redirect_url: 'https://www.airsial.com.pk/booking' },
            // Fly Jinnah
            { airline_id: airlineMap['FJ'], from_airport: 'Karachi (KHI)', to_airport: 'Lahore (LHE)', departure_time: '06:30', arrival_time: '07:45', duration: '1h 15m', stops: 0, price: 14000, real_redirect_url: 'https://www.flyjinnah.com/booking' },
            { airline_id: airlineMap['FJ'], from_airport: 'Karachi (KHI)', to_airport: 'Islamabad (ISB)', departure_time: '09:00', arrival_time: '10:30', duration: '1h 30m', stops: 0, price: 18000, real_redirect_url: 'https://www.flyjinnah.com/booking' },
            { airline_id: airlineMap['FJ'], from_airport: 'Islamabad (ISB)', to_airport: 'Lahore (LHE)', departure_time: '17:00', arrival_time: '17:55', duration: '0h 55m', stops: 0, price: 11000, real_redirect_url: 'https://www.flyjinnah.com/booking' },
        ];
        await PakFlight.bulkCreate(FLIGHTS);
        console.log('✅ Pakistan Flights seeded!');
    }
};
// ─────────────────────────────────────────────────────────────────────────────

const seedTravelPackages = async () => {
    const { TravelAgency, TravelPackage } = require('./model/travelPackageIndex');
    const { AGENCIES, buildPackages } = require('./data/travelPackagesSeed');

    const agencyCount = await TravelAgency.count();
    if (agencyCount === 0) {
        const created = await TravelAgency.bulkCreate(AGENCIES);
        const codeMap = Object.fromEntries(created.map((a) => [a.code, a]));

        const catalog = buildPackages();
        const rows = catalog.map((p) => {
            const agency = codeMap[p.agencyCode];
            const { agencyCode, ...rest } = p;
            return {
                ...rest,
                agency_id: agency.id,
                booking_url_override: null,
                is_active: true,
            };
        });
        await TravelPackage.bulkCreate(rows);
        console.log(`✅ Travel packages seeded! (${rows.length} packages, ${AGENCIES.length} agencies)`);
    }
};

// Connect to Database and Sync
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        // Sync & seed before accepting HTTP — avoids pool exhaustion / table locks during API calls
        if (process.env.SKIP_DB_SYNC !== '1') {
            try {
                console.log('Syncing database (first start may take a minute)...');
                await sequelize.sync();
                await ensureGoogleAuthSchema(sequelize);
                await ensurePasswordResetSchema(sequelize);
                console.log('Database synced successfully.');

                await seedDestinations();
                await seedFlights();
                await seedHotels();
                await seedTransport();
                await seedPakTransport();
                await seedNotifications();
                await seedSafetyData();
                await seedAdmin();
                await seedPakAirlines();
                await seedPakFlights();
                await seedTravelPackages();
            } catch (syncErr) {
                console.error('Database sync warning (continuing):', syncErr.message);
            }
        } else {
            console.log('SKIP_DB_SYNC=1 — skipping sync/seed');
        }

        verifyMailConfig().catch(() => {});

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server started on port ${PORT}`);
            logFrontendUrlHint();
        });

        // Keep MySQL connection alive - ping every 5 minutes
        setInterval(async () => {
            try {
                await sequelize.authenticate();
            } catch (pingErr) {
                console.warn('⚠️  DB ping failed, reconnecting...', pingErr.message);
                try {
                    await sequelize.authenticate();
                    console.log('✅ DB reconnected successfully.');
                } catch (reconnectErr) {
                    console.error('❌ DB reconnect failed:', reconnectErr.message);
                }
            }
        }, 5 * 60 * 1000); // every 5 minutes

    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};


// ─── Global crash protection ──────────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️  Unhandled Promise Rejection:', reason?.message || reason);
    // DO NOT exit - keep server running
});

process.on('uncaughtException', (err) => {
    console.error('⚠️  Uncaught Exception:', err.message);
    // DO NOT exit - keep server running
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing gracefully...');
    sequelize.close();
    process.exit(0);
});
// ─────────────────────────────────────────────────────────────────────────────

startServer();
