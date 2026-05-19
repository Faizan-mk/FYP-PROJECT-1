const { PakAirline, PakFlight, FlightClick } = require('../model/pakFlightsIndex');
const { Op } = require('sequelize');
const Amadeus = require('amadeus');

// Initialize Amadeus client
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET
});

// Airline Names Mapping for Global API
const AIRLINE_NAMES = {
    'PK': 'PIA',
    'PA': 'Airblue',
    'ER': 'SereneAir',
    'PF': 'AirSial',
    'FJ': 'Fly Jinnah',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'EY': 'Etihad',
    'GF': 'Gulf Air',
    'WY': 'Oman Air',
    'SV': 'Saudia',
    'TK': 'Turkish Airlines',
    'FZ': 'flydubai',
    'G9': 'Air Arabia',
    'J9': 'Jazeera Airways',
    'XY': 'Flynas',
};

// IATA Codes Mapping
const CITY_TO_IATA = {
    'karachi': 'KHI',
    'lahore': 'LHE',
    'islamabad': 'ISB',
    'peshawar': 'PEW',
    'quetta': 'UET',
    'multan': 'MUX',
    'sialkot': 'SKT',
    'faisalabad': 'LYP',
    'dubai': 'DXB',
    'jeddah': 'JED',
    'london': 'LHR',
    'new york': 'JFK',
    'istanbul': 'IST',
    'toronto': 'YYZ',
};

// ──────────────────────────────────────────────────────────
// Helper: Enrich with real-time variables
// ──────────────────────────────────────────────────────────
const getLiveEnrichment = (price, flightId) => {
    const minuteSeed = Math.floor(Date.now() / 60000);
    const seed = ((flightId || 1) * 7919 + minuteSeed * 1234567) % 73;

    // Status Logic
    const statusIdx = seed % 4; // 0,1,2,3
    const statusMap = [
        { s: 'On Time', c: 'green' },
        { s: 'On Time ✓', c: 'green' },
        { s: 'Boarding', c: 'blue' },
        { s: 'Delayed', c: 'red' }
    ];

    // Price Fluctuation (seeded)
    const factor = 1 + ((seed % 15 - 7) / 100); // ±7%

    return {
        livePrice: Math.round(price * factor),
        status: statusMap[statusIdx].s,
        statusColor: statusMap[statusIdx].c,
        seats: 5 + (seed % 45)
    };
};

// ──────────────────────────────────────────────────────────
// GET /api/pak-airlines
// ──────────────────────────────────────────────────────────
const getAllAirlines = async (req, res) => {
    try {
        const airlines = await PakAirline.findAll({ order: [['name', 'ASC']] });
        res.json(airlines);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch airlines' });
    }
};

// ──────────────────────────────────────────────────────────
// GET /api/pak-flights/search (Real-Time Hybrid API)
// ──────────────────────────────────────────────────────────
const searchFlights = async (req, res) => {
    try {
        const { airlineCode, from, to, date, passengers = 1 } = req.query;
        const pax = parseInt(passengers, 10) || 1;

        // IATA mappings
        const fromLookup = from?.toLowerCase().split('(')[0].trim();
        const toLookup = to?.toLowerCase().split('(')[0].trim();
        const originIATA = fromLookup ? (CITY_TO_IATA[fromLookup] || from.toUpperCase()) : null;
        const destIATA = toLookup ? (CITY_TO_IATA[toLookup] || to.toUpperCase()) : null;

        let liveApiFlights = [];
        let sourceUsed = 'local_db';

        // 1. Try Live Amadeus API
        const isKeyConfigured = process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_KEY !== 'your_amadeus_api_key_here';

        if (isKeyConfigured && originIATA && destIATA) {
            try {
                const response = await amadeus.shopping.flightOffersSearch.get({
                    originLocationCode: originIATA,
                    destinationLocationCode: destIATA,
                    departureDate: date || new Date().toISOString().split('T')[0],
                    adults: pax,
                    max: 15
                });

                if (response.data && response.data.length > 0) {
                    sourceUsed = 'amadeus_api';
                    liveApiFlights = response.data.map((offer, idx) => {
                        const itinerary = offer.itineraries[0];
                        const segment = itinerary.segments[0];
                        const carrier = segment.carrierCode;
                        const basePrice = parseFloat(offer.price.total);
                        const currency = offer.price.currency;

                        // Convert to PKR (rough estimate for FYP)
                        const exchangeRate = currency === 'EUR' ? 305 : currency === 'USD' ? 285 : 1;
                        const pkrPriceTotal = Math.round(basePrice * exchangeRate);

                        return {
                            id: `live-${carrier}-${idx}`,
                            airline: {
                                name: AIRLINE_NAMES[carrier] || `Airline ${carrier}`,
                                code: carrier,
                                logo: '✈️'
                            },
                            from_airport: `${segment.departure.iataCode} Airport`,
                            to_airport: `${segment.arrival.iataCode} Airport`,
                            departure_time: segment.departure.at.split('T')[1].substring(0, 5),
                            arrival_time: segment.arrival.at.split('T')[1].substring(0, 5),
                            duration: itinerary.duration.replace('PT', '').toLowerCase(),
                            stops: itinerary.segments.length - 1,
                            price: Math.round(pkrPriceTotal / pax),
                            totalPrice: pkrPriceTotal,
                            isRealAPI: true,
                            source: 'amadeus_live',
                            redirect_url: `https://www.google.com/search?q=${carrier}+flight+booking+${originIATA}+to+${destIATA}`
                        };
                    });
                }
            } catch (apiErr) {
                console.warn('Real API Fail (Falling back to DB):', apiErr.message);
            }
        }

        // 2. Local Domestic DB Search (Enriched with Live simulation)
        const airlineWhere = {};
        if (airlineCode) airlineWhere.code = airlineCode.toUpperCase();

        const flightWhere = {};
        if (from) flightWhere.from_airport = { [Op.like]: `%${from}%` };
        if (to) flightWhere.to_airport = { [Op.like]: `%${to}%` };

        const dbFlights = await PakFlight.findAll({
            where: flightWhere,
            include: [{
                model: PakAirline,
                as: 'airline',
                where: airlineWhere,
                attributes: ['id', 'name', 'code', 'logo', 'website']
            }],
            order: [['price', 'ASC']]
        });

        const formattedDB = dbFlights.map(f => {
            const plain = f.toJSON();
            const { livePrice, status, statusColor, seats } = getLiveEnrichment(plain.price, plain.id);

            return {
                ...plain,
                price: livePrice,
                totalPrice: livePrice * pax,
                status,
                statusColor,
                seatsLeft: seats,
                seatsUrgent: seats < 12,
                isRealAPI: false,
                source: 'domestic_verified',
                redirect_url: `/api/pak-flights/redirect/${plain.id}`
            };
        });

        // 3. Final Aggregation
        const results = [...liveApiFlights, ...formattedDB];

        // Final enrichment for LIVE API results (status/seats)
        const finalResults = results.map(f => {
            if (f.isRealAPI) {
                const { status, statusColor, seats } = getLiveEnrichment(f.price, f.id.length);
                return { ...f, status, statusColor, seatsLeft: seats, seatsUrgent: seats < 12 };
            }
            return f;
        });

        res.json({
            flights: finalResults,
            meta: {
                count: finalResults.length,
                isLive: true,
                liveApiActive: sourceUsed === 'amadeus_api',
                refreshedAt: new Date().toISOString(),
                passengers: pax
            }
        });

    } catch (err) {
        console.error('searchFlights error:', err);
        res.status(500).json({ error: 'Flight search failed' });
    }
};

// ──────────────────────────────────────────────────────────
// GET /api/pak-flights/redirect/:id
// ──────────────────────────────────────────────────────────
const redirectFlight = async (req, res) => {
    try {
        const { id } = req.params;
        // If it's a live ID, handled by frontend or direct link. 
        // We only log clicks for DB items.
        if (id.startsWith('live-')) return res.redirect('https://google.com/flights');

        const flight = await PakFlight.findByPk(id, { include: [{ model: PakAirline, as: 'airline' }] });
        if (!flight) return res.redirect('https://google.com/flights');

        await FlightClick.create({
            flight_id: flight.id,
            ip_address: req.ip || '',
            user_agent: req.headers['user-agent'] || ''
        });

        res.redirect(flight.real_redirect_url || flight.airline?.website || 'https://google.com/flights');
    } catch (err) {
        res.status(500).send('Redirect error');
    }
};

module.exports = { getAllAirlines, searchFlights, redirectFlight };
