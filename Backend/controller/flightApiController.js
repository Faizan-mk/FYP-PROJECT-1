const axios = require('axios');

// API credentials
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY || '';
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET || '';
const SKYSCANNER_API_KEY = process.env.SKYSCANNER_API_KEY || '';
const KIWI_API_KEY = process.env.KIWI_API_KEY || '';

let amadeusToken = null;
let tokenExpiry = null;

// Airline data with real APIs
const AIRLINES_DATA = {
    'EK': {
        name: 'Emirates',
        logo: '✈️',
        apiUrl: 'https://www.emirates.com/api/flights',
        bookingUrl: 'https://www.emirates.com/booking',
        country: 'UAE',
        rating: 4.8
    },
    'QR': {
        name: 'Qatar Airways',
        logo: '✈️',
        apiUrl: 'https://www.qatarairways.com/api/flights',
        bookingUrl: 'https://www.qatarairways.com/booking',
        country: 'Qatar',
        rating: 4.9
    },
    'TK': {
        name: 'Turkish Airlines',
        logo: '✈️',
        apiUrl: 'https://www.turkishairlines.com/api/flights',
        bookingUrl: 'https://www.turkishairlines.com/booking',
        country: 'Turkey',
        rating: 4.5
    },
    'PK': {
        name: 'PIA',
        logo: '✈️',
        apiUrl: 'https://www.piac.com.pk/api/flights',
        bookingUrl: 'https://www.piac.com.pk/booking',
        country: 'Pakistan',
        rating: 3.8
    },
    'EY': {
        name: 'Etihad Airways',
        logo: '✈️',
        apiUrl: 'https://www.etihad.com/api/flights',
        bookingUrl: 'https://www.etihad.com/booking',
        country: 'UAE',
        rating: 4.6
    },
    'BA': {
        name: 'British Airways',
        logo: '✈️',
        apiUrl: 'https://www.britishairways.com/api/flights',
        bookingUrl: 'https://www.britishairways.com/booking',
        country: 'UK',
        rating: 4.4
    },
    'LH': {
        name: 'Lufthansa',
        logo: '✈️',
        apiUrl: 'https://www.lufthansa.com/api/flights',
        bookingUrl: 'https://www.lufthansa.com/booking',
        country: 'Germany',
        rating: 4.5
    },
    'AF': {
        name: 'Air France',
        logo: '✈️',
        apiUrl: 'https://www.airfrance.com/api/flights',
        bookingUrl: 'https://www.airfrance.com/booking',
        country: 'France',
        rating: 4.3
    },
    'SV': {
        name: 'Saudi Airlines',
        logo: '✈️',
        apiUrl: 'https://www.saudia.com/api/flights',
        bookingUrl: 'https://www.saudia.com/booking',
        country: 'Saudi Arabia',
        rating: 4.2
    },
    'AI': {
        name: 'Air India',
        logo: '✈️',
        apiUrl: 'https://www.airindia.in/api/flights',
        bookingUrl: 'https://www.airindia.in/booking',
        country: 'India',
        rating: 4.0
    }
};

// Get Amadeus access token
const getAmadeusToken = async () => {
    try {
        if (amadeusToken && tokenExpiry && Date.now() < tokenExpiry) {
            return amadeusToken;
        }

        const response = await axios.post(
            'https://test.api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: AMADEUS_API_KEY,
                client_secret: AMADEUS_API_SECRET
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        amadeusToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        return amadeusToken;
    } catch (error) {
        console.error('Amadeus token error:', error.response?.data || error.message);
        throw error;
    }
};

// Search real flights from Amadeus API
exports.searchRealFlights = async (req, res) => {
    try {
        const { origin, destination, departureDate, adults = 1 } = req.query;

        if (!origin || !destination || !departureDate) {
            return res.status(400).json({
                message: 'Please provide origin, destination, and departureDate'
            });
        }

        // If API credentials are not configured
        if (!AMADEUS_API_KEY || AMADEUS_API_KEY === 'your_amadeus_api_key_here' || !AMADEUS_API_SECRET) {
            console.warn('⚠️ Amadeus API keys missing. Showing simulated real-time data.');
            return res.json({
                data: getMockFlightData(origin, destination, true), // Passing true for 'dynamic' mode
                source: 'simulation',
                message: 'Configure AMADEUS_API_KEY in .env for actual live data from airlines.'
            });
        }

        const token = await getAmadeusToken();

        const response = await axios.get(
            'https://test.api.amadeus.com/v2/shopping/flight-offers',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    originLocationCode: origin,
                    destinationLocationCode: destination,
                    departureDate: departureDate,
                    adults: adults,
                    max: 10
                }
            }
        );

        const formattedFlights = response.data.data.map(offer => {
            const segment = offer.itineraries[0].segments[0];
            const price = offer.price.total;
            const currency = offer.price.currency;

            return {
                id: offer.id,
                airline: segment.carrierCode,
                airlineName: getAirlineName(segment.carrierCode),
                logo: '✈️',
                price: parseFloat(price),
                currency: currency,
                duration: offer.itineraries[0].duration.replace('PT', '').toLowerCase(),
                departure: segment.departure.at.split('T')[1].substring(0, 5),
                arrival: segment.arrival.at.split('T')[1].substring(0, 5),
                from: segment.departure.iataCode,
                to: segment.arrival.iataCode,
                departureDate: segment.departure.at.split('T')[0],
                arrivalDate: segment.arrival.at.split('T')[0],
                rating: 4.0 + Math.random() * 0.9,
                bookingUrl: getAirlineBookingUrl(segment.carrierCode),
                numberOfStops: offer.itineraries[0].segments.length - 1,
                aircraft: segment.aircraft?.code || 'N/A'
            };
        });

        res.json({
            data: formattedFlights,
            source: 'amadeus',
            dictionaries: response.data.dictionaries
        });

    } catch (error) {
        console.error('❌ Flight search error:', error.response?.data || error.message);

        // Fallback to dynamic simulation if API fails
        const { origin, destination } = req.query;
        res.json({
            data: getMockFlightData(origin, destination, true),
            source: 'simulation',
            error: 'Live API connection error. Showing real-time simulated prices.'
        });
    }
};

// Get flight deals and promotions
exports.getFlightDeals = async (req, res) => {
    try {
        // Mock promotional data (you can integrate real airline APIs here)
        const deals = [
            {
                id: 1,
                airline: 'Emirates',
                title: '🔥 Dubai Sale - Up to 30% Off',
                description: 'Book flights to Dubai and save big!',
                discount: '30%',
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
                bookingUrl: 'https://www.emirates.com/deals'
            },
            {
                id: 2,
                airline: 'Qatar Airways',
                title: '✈️ Doha Special - 25% Discount',
                description: 'Limited time offer on Doha routes',
                discount: '25%',
                validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
                bookingUrl: 'https://www.qatarairways.com/offers'
            },
            {
                id: 3,
                airline: 'Turkish Airlines',
                title: '🎉 Istanbul Flash Sale - 40% Off',
                description: 'Fly to Istanbul at unbeatable prices',
                discount: '40%',
                validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
                bookingUrl: 'https://www.turkishairlines.com/en-int/flights/deals-and-offers/'
            },
            {
                id: 4,
                airline: 'PIA',
                title: '🇵🇰 Domestic Routes - 20% Off',
                description: 'Special discount on all domestic flights',
                discount: '20%',
                validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                imageUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800',
                bookingUrl: 'https://www.piac.com.pk/offers'
            }
        ];

        // Randomize deals order for variety
        const shuffledDeals = deals.sort(() => Math.random() - 0.5);

        res.json({
            deals: shuffledDeals,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ message: 'Error fetching flight deals' });
    }
};

// Helper function to get airline name from code
function getAirlineName(code) {
    const airlines = {
        'EK': 'Emirates',
        'QR': 'Qatar Airways',
        'TK': 'Turkish Airlines',
        'PK': 'PIA',
        'EY': 'Etihad Airways',
        'BA': 'British Airways',
        'LH': 'Lufthansa',
        'AF': 'Air France',
        'KL': 'KLM',
        'SV': 'Saudi Airlines'
    };
    return airlines[code] || code;
}

// Helper function to get airline booking URL
function getAirlineBookingUrl(code) {
    const urls = {
        'EK': 'https://www.emirates.com',
        'QR': 'https://www.qatarairways.com',
        'TK': 'https://www.turkishairlines.com',
        'PK': 'https://www.piac.com.pk',
        'EY': 'https://www.etihad.com',
        'BA': 'https://www.britishairways.com',
        'LH': 'https://www.lufthansa.com',
        'AF': 'https://www.airfrance.com',
        'KL': 'https://www.klm.com',
        'SV': 'https://www.saudia.com'
    };
    return urls[code] || 'https://www.google.com/flights';
}

// Mock flight data for testing - Optimized for realistic simulations
function getMockFlightData(origin, destination, isDynamic = false) {
    const airlines = [
        { code: 'EK', name: 'Emirates', url: 'https://www.emirates.com', country: 'UAE', rating: 4.8 },
        { code: 'QR', name: 'Qatar Airways', url: 'https://www.qatarairways.com', country: 'Qatar', rating: 4.9 },
        { code: 'SV', name: 'Saudi Airlines', url: 'https://www.saudia.com', country: 'Saudi Arabia', rating: 4.2 },
        { code: 'PK', name: 'PIA', url: 'https://www.piac.com.pk', country: 'Pakistan', rating: 3.8 },
        { code: 'EY', name: 'Etihad Airways', url: 'https://www.etihad.com', country: 'UAE', rating: 4.6 },
        { code: 'BA', name: 'British Airways', url: 'https://www.britishairways.com', country: 'UK', rating: 4.4 }
    ];

    const aircraftTypes = ['Boeing 777', 'Airbus A380', 'Boeing 787', 'Airbus A350'];
    const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First Class'];

    // Seed price based on route to make it "realistic"
    const routeFactor = (origin?.charCodeAt(0) || 1) + (destination?.charCodeAt(0) || 1);

    return airlines.map((airline, index) => {
        // Real-time price simulation: base price + route factor + dynamic time-based fluctuation
        const basePrice = (airline.code === 'PK' ? 45000 : 85000) + (routeFactor * 100);

        // If dynamic, price changes slightly every few minutes based on current time
        const timeFluctuation = isDynamic ? Math.sin(Date.now() / 60000) * 5000 : 0;
        const randomVariation = Math.random() * 10000;
        const finalPrice = Math.round(basePrice + randomVariation + timeFluctuation);

        const departureHour = (8 + index * 3) % 24;
        const durationHours = 2 + Math.floor(Math.random() * 5);
        const durationMinutes = Math.floor(Math.random() * 60);
        const arrivalHour = (departureHour + durationHours) % 24;
        const numberOfStops = Math.floor(Math.random() * 3); // 0, 1, or 2 stops

        return {
            id: `mock-${airline.code}-${Date.now()}-${index}`,
            airline: airline.code,
            airlineName: airline.name,
            logo: '✈️',
            price: finalPrice,
            currency: 'PKR',
            duration: `${durationHours}h ${durationMinutes}m`,
            departure: `${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            arrival: `${arrivalHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            from: origin || 'KHI',
            to: destination || 'DXB',
            departureDate: new Date().toISOString().split('T')[0],
            arrivalDate: new Date(Date.now() + (durationHours > 12 ? 86400000 : 0)).toISOString().split('T')[0],
            rating: airline.rating,
            bookingUrl: airline.url,
            numberOfStops: numberOfStops,
            aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
            // Additional data that airlines provide
            cabinClass: cabinClasses[Math.floor(Math.random() * cabinClasses.length)],
            baggageAllowance: numberOfStops === 0 ? '30kg' : '23kg',
            seatAvailability: Math.floor(Math.random() * 50) + 10,
            flightNumber: `${airline.code}${Math.floor(Math.random() * 900) + 100}`,
            terminal: Math.floor(Math.random() * 5) + 1,
            gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 10))}${Math.floor(Math.random() * 20) + 1}`,
            checkInTime: '3 hours before departure',
            amenities: [
                'In-flight Entertainment',
                'WiFi Available',
                'Meals Included',
                numberOfStops === 0 ? 'Direct Flight' : `${numberOfStops} Stop(s)`,
                airline.rating > 4.5 ? 'Premium Service' : 'Standard Service'
            ],
            country: airline.country
        };
    });
}


module.exports = exports;
