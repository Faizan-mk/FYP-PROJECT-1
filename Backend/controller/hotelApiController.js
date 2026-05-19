// hotelApiController.js — Live Hotel Feed with real-time price simulation

const HOTELS = [
    {
        id: 'h1',
        name: 'Pearl Continental Lahore',
        city: 'Lahore',
        area: 'Shahrah-e-Quaid-e-Azam',
        stars: 5,
        basePrice: 28000,
        rating: 4.7,
        totalReviews: 2340,
        logo: '🏛️',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service', 'Valet Parking', 'Business Center'],
        breakfast: true,
        wifi: true,
        pool: true,
        spa: true,
        roomTypes: ['Deluxe Room', 'Executive Suite', 'Presidential Suite'],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        bookingUrl: 'https://www.pchotels.com',
        description: "Pakistan's iconic 5-star landmark. Featuring 330 luxurious rooms, world-class dining, and unmatched hospitality since 1976.",
        phone: '+92-42-111-505-505',
        totalRooms: 330,
        roomsAvailable: 18,
        website: 'https://www.pchotels.com',
    },
    {
        id: 'h2',
        name: 'Serena Hotel Islamabad',
        city: 'Islamabad',
        area: 'Diplomatic Enclave',
        stars: 5,
        basePrice: 38000,
        rating: 4.8,
        totalReviews: 3120,
        logo: '🌿',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200',
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200',
            'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Fine Dining', '24h Room Service', 'Concierge', 'Helipad'],
        breakfast: true,
        wifi: true,
        pool: true,
        spa: true,
        roomTypes: ['Superior Room', 'Deluxe Room', 'Junior Suite', 'Presidential Suite'],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        bookingUrl: 'https://www.serenahotels.com',
        description: "A haven of elegance in Islamabad's Diplomatic Enclave. Acclaimed for its Mughal-inspired architecture and impeccable service.",
        phone: '+92-51-111-133-133',
        totalRooms: 257,
        roomsAvailable: 9,
        website: 'https://www.serenahotels.com',
    },
    {
        id: 'h3',
        name: 'Movenpick Hotel Karachi',
        city: 'Karachi',
        area: 'Club Road, PECHS',
        stars: 4,
        basePrice: 18000,
        rating: 4.3,
        totalReviews: 1870,
        logo: '🔵',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Rooftop Pool', 'Spa', 'Gym', 'All-Day Dining', 'Bar & Lounge', 'Shuttle Service'],
        breakfast: true,
        wifi: true,
        pool: true,
        spa: false,
        roomTypes: ['Standard Room', 'Superior Room', 'Suite'],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        bookingUrl: 'https://www.movenpick.com/karachi',
        description: "Contemporary luxury in Karachi's business district. Perfect for corporate and leisure travelers with state-of-the-art facilities.",
        phone: '+92-21-111-686-686',
        totalRooms: 191,
        roomsAvailable: 34,
        website: 'https://www.movenpick.com',
    },
    {
        id: 'h4',
        name: 'Avari Towers Karachi',
        city: 'Karachi',
        area: 'Fatima Jinnah Road',
        stars: 5,
        basePrice: 24000,
        rating: 4.5,
        totalReviews: 2780,
        logo: '🏙️',
        image: 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=1200',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Swimming Pool', 'Gym', 'Multi-Cuisine Restaurant', 'Bakery', 'Conference Halls', 'Travel Desk'],
        breakfast: true,
        wifi: true,
        pool: true,
        spa: false,
        roomTypes: ['Standard Room', 'Deluxe Room', 'Tower Suite'],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        bookingUrl: 'https://www.avari.com',
        description: "Karachi's landmark tower hotel with panoramic city views. Home to award-winning restaurants and top-tier event spaces.",
        phone: '+92-21-111-582-748',
        totalRooms: 200,
        roomsAvailable: 22,
        website: 'https://www.avari.com',
    },
    {
        id: 'h5',
        name: 'Hunza Serena Inn',
        city: 'Hunza',
        area: 'Karimabad, Hunza Valley',
        stars: 4,
        basePrice: 15000,
        rating: 4.6,
        totalReviews: 980,
        logo: '🏔️',
        image: 'https://images.unsplash.com/photo-1601758260944-92b84b9e2a6e?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1601758260944-92b84b9e2a6e?q=80&w=1200',
            'https://images.unsplash.com/photo-1612423284934-2850a4ea4b25?q=80&w=1200',
            'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Mountain View', 'Restaurant', 'Trekking Guides', 'Fire Lounge', 'Cultural Evenings', 'Jeep Tours'],
        breakfast: true,
        wifi: true,
        pool: false,
        spa: false,
        roomTypes: ['Standard Room', 'Mountain View Room', 'Cottage Suite'],
        checkInTime: '13:00',
        checkOutTime: '11:00',
        bookingUrl: 'https://www.serenahotels.com/hunza',
        description: "Nestled in the breathtaking Karakoram, Hunza Serena Inn offers authentic mountain hospitality with stunning Rakaposhi views.",
        phone: '+92-5813-457-139',
        totalRooms: 36,
        roomsAvailable: 7,
        website: 'https://www.serenahotels.com',
    },
    {
        id: 'h6',
        name: 'Faletti\'s Hotel Lahore',
        city: 'Lahore',
        area: 'Egerton Road, City Center',
        stars: 4,
        basePrice: 12000,
        rating: 4.2,
        totalReviews: 1450,
        logo: '🏛️',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c4a49f33?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1551882547-ff40c4a49f33?q=80&w=1200',
            'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200',
            'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Heritage Garden', 'Restaurant', 'Bar', 'Conference Room', 'Laundry'],
        breakfast: true,
        wifi: true,
        pool: false,
        spa: false,
        roomTypes: ['Classic Room', 'Heritage Room', 'Junior Suite'],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        bookingUrl: 'https://www.falettis.com',
        description: "A colonial-era classic, Faletti's Hotel has hosted royals and dignitaries since 1880. A living piece of Lahore's history.",
        phone: '+92-42-111-327-327',
        totalRooms: 82,
        roomsAvailable: 15,
        website: 'https://www.falettis.com',
    },
    {
        id: 'h7',
        name: 'Marriott Hotel Islamabad',
        city: 'Islamabad',
        area: 'Aga Khan Road, F-5',
        stars: 5,
        basePrice: 32000,
        rating: 4.6,
        totalReviews: 4100,
        logo: '🌐',
        image: 'https://images.unsplash.com/photo-1614957004131-9e8f2b7b2d89?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1614957004131-9e8f2b7b2d89?q=80&w=1200',
            'https://images.unsplash.com/photo-1611347418644-be41a09e41d7?q=80&w=1200',
            'https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Outdoor Pool', 'Fitness Center', 'Spa', 'Nathiagali Restaurant', 'Lobby Lounge', 'Rooftop Bar', 'Business Center'],
        breakfast: true,
        wifi: true,
        pool: true,
        spa: true,
        roomTypes: ['Deluxe Room', 'Club Level Room', 'Junior Suite', 'Executive Suite'],
        checkInTime: '15:00',
        checkOutTime: '12:00',
        bookingUrl: 'https://www.marriott.com/islamabad',
        description: "Islamabad's premier internationally-branded hotel. A landmark property featuring world-class dining and event facilities in the heart of the capital.",
        phone: '+92-51-282-7311',
        totalRooms: 284,
        roomsAvailable: 28,
        website: 'https://www.marriott.com',
    },
    {
        id: 'h8',
        name: 'Lotus Hotel Skardu',
        city: 'Skardu',
        area: 'Shiger Road, Skardu Valley',
        stars: 3,
        basePrice: 8500,
        rating: 4.4,
        totalReviews: 620,
        logo: '🌸',
        image: 'https://images.unsplash.com/photo-1597248881519-db089d3744e0?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1597248881519-db089d3744e0?q=80&w=1200',
            'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200',
            'https://images.unsplash.com/photo-1591557637031-27f9a1c4f12b?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'River View', 'Home-cooked Meals', 'Jeep Rental', 'Trek Guides', 'Bonfire Nights'],
        breakfast: true,
        wifi: true,
        pool: false,
        spa: false,
        roomTypes: ['Standard Room', 'River View Room', 'Family Room'],
        checkInTime: '12:00',
        checkOutTime: '11:00',
        bookingUrl: 'https://www.booking.com/hotel/pk/lotus-skardu.html',
        description: "An authentic mountain retreat with breathtaking views of the Indus River and K2 in the distance. The ideal base for Karakoram adventures.",
        phone: '+92-300-591-0000',
        totalRooms: 28,
        roomsAvailable: 5,
        website: 'https://www.booking.com',
    },
    {
        id: 'h9',
        name: 'Ramada by Wyndham Lahore',
        city: 'Lahore',
        area: 'Main Boulevard, Gulberg',
        stars: 4,
        basePrice: 16000,
        rating: 4.1,
        totalReviews: 1890,
        logo: '🔴',
        image: 'https://images.unsplash.com/photo-1587213811864-c7acde42c9c5?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1587213811864-c7acde42c9c5?q=80&w=1200',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200',
            'https://images.unsplash.com/photo-1521477716071-37cfe0f88ca4?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Indoor Pool', 'Gym', 'Spa', 'Rooftop Restaurant', 'Valet Parking', 'Airport Shuttle'],
        breakfast: false,
        wifi: true,
        pool: true,
        spa: true,
        roomTypes: ['Standard Room', 'Superior Room', 'Suite'],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        bookingUrl: 'https://www.wyndhamhotels.com/ramada/lahore',
        description: "International standards meet Punjab hospitality at Ramada Gulberg. Centrally located near Lahore's top restaurants, malls, and cultural sites.",
        phone: '+92-42-111-726-232',
        totalRooms: 150,
        roomsAvailable: 41,
        website: 'https://www.wyndhamhotels.com',
    },
    {
        id: 'h10',
        name: 'Beach Luxury Hotel Karachi',
        city: 'Karachi',
        area: 'Moulvi Tamizuddin Khan Road',
        stars: 4,
        basePrice: 14000,
        rating: 4.0,
        totalReviews: 1120,
        logo: '🌊',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200',
            'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=1200',
            'https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Poolside Bar', 'Restaurant', 'Banquet Hall', 'Travel Desk', 'Currency Exchange'],
        breakfast: false,
        wifi: true,
        pool: true,
        spa: false,
        roomTypes: ['Standard Room', 'Deluxe Room', 'Penthouse Suite'],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        bookingUrl: 'https://www.beachluxury.com.pk',
        description: "Karachi's beloved beachside retreat. Known for its iconic poolside parties, prime location and stunning sea breeze views.",
        phone: '+92-21-3568-0061',
        totalRooms: 112,
        roomsAvailable: 19,
        website: 'https://www.beachluxury.com.pk',
    },
    {
        id: 'h11',
        name: 'Nishat Hotel Lahore',
        city: 'Lahore',
        area: 'MM Alam Road, Gulberg III',
        stars: 5,
        basePrice: 22000,
        rating: 4.5,
        totalReviews: 2010,
        logo: '🌺',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
            'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1200',
            'https://images.unsplash.com/photo-1551776235-dde6d482980b?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Rooftop Pool', 'Spa', 'Gym', '6 Restaurants', 'Rooftop Bar', 'Event Lawns', 'Valet Parking'],
        breakfast: true,
        wifi: true,
        pool: true,
        spa: true,
        roomTypes: ['Premier Room', 'Deluxe Room', 'Nishat Suite', 'Royal Suite'],
        checkInTime: '15:00',
        checkOutTime: '12:00',
        bookingUrl: 'https://www.nishathotels.com',
        description: "Lahore's newest luxury landmark in the heart of Gulberg. Boasting the city's most stunning rooftop, 6 distinct restaurants, and a world-class spa.",
        phone: '+92-42-111-647-428',
        totalRooms: 160,
        roomsAvailable: 12,
        website: 'https://www.nishathotels.com',
    },
    {
        id: 'h12',
        name: 'Pearl Continental Bhurban',
        city: 'Murree',
        area: 'Bhurban Hill Station',
        stars: 5,
        basePrice: 20000,
        rating: 4.6,
        totalReviews: 3560,
        logo: '⛰️',
        image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1200&auto=format&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1200',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
        ],
        amenities: ['Free WiFi', 'Indoor Heated Pool', 'Spa', 'Gym', 'Golf Course', 'Kids Club', 'Bonfire', 'Horse Riding'],
        breakfast: true,
        wifi: true,
        pool: true,
        spa: true,
        roomTypes: ['Hill View Room', 'Deluxe Room', 'Suite', 'Presidential Suite'],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        bookingUrl: 'https://www.pchotels.com/bhurban',
        description: "Pakistan's finest mountain resort perched 6,500 ft above sea level. The ultimate escape with a golf course, spa, and breathtaking Himalayan views.",
        phone: '+92-51-111-505-505',
        totalRooms: 244,
        roomsAvailable: 6,
        website: 'https://www.pchotels.com',
    },
];

const CITIES = ['All', 'Lahore', 'Islamabad', 'Karachi', 'Hunza', 'Murree', 'Skardu'];

const { Hotel } = require('../model');

function parseImages(images) {
    if (typeof images === 'string') {
        try {
            return JSON.parse(images);
        } catch {
            return {};
        }
    }
    return images && typeof images === 'object' ? images : {};
}

function dbHotelToCatalog(hotel) {
    const meta = parseImages(hotel.images);
    const gallery = Array.isArray(meta.gallery) ? meta.gallery.filter(Boolean) : [];
    const mainImage = hotel.image || gallery[0] || '';
    const allImages = [mainImage, ...gallery].filter((u, i, a) => u && a.indexOf(u) === i);

    return {
        id: hotel.id,
        name: hotel.name,
        city: meta.city || 'Pakistan',
        area: meta.city || 'Pakistan',
        stars: hotel.stars ?? 4,
        basePrice: Number(hotel.price) || 10000,
        rating: hotel.rating ?? 4,
        image: mainImage,
        images: allImages.length ? allImages : [mainImage].filter(Boolean),
        amenities: Array.isArray(meta.services) && meta.services.length ? meta.services : ['Free WiFi'],
        breakfast: hotel.breakfast !== false,
        wifi: hotel.wifi !== false,
        bookingUrl: hotel.bookingUrl || '',
        description: meta.description || `${hotel.name} in ${meta.city || 'Pakistan'}.`,
        roomsAvailable: Number(meta.roomsAvailable) >= 0 ? Number(meta.roomsAvailable) : 12,
        fromDatabase: true,
    };
}

function applyLivePricing(catalog, timeSeed, fluctFactor, currentTime) {
    return catalog.map((hotel, i) => {
        const fluctuation = Math.round(fluctFactor * 1500 * ((i % 3) + 1));
        const livePrice = Math.max(hotel.basePrice + fluctuation, hotel.basePrice - 2000);
        const roomSeed = Math.floor(timeSeed / 2 + i * 7);
        const liveRooms = Math.max(1, (hotel.roomsAvailable + (roomSeed % 5) - 2));

        return {
            ...hotel,
            livePrice,
            roomsAvailable: liveRooms,
            priceChange: fluctuation > 0 ? 'up' : fluctuation < 0 ? 'down' : 'stable',
            lastUpdated: currentTime.toISOString(),
            isLive: true,
        };
    });
}

async function buildCatalog() {
    let dbRows = [];
    try {
        dbRows = await Hotel.findAll({ order: [['name', 'ASC']] });
    } catch (e) {
        console.warn('Could not load DB hotels for live feed:', e.message);
    }

    const dbCatalog = dbRows.map((row) => dbHotelToCatalog(row.get({ plain: true })));
    const dbNames = new Set(dbCatalog.map((h) => h.name.toLowerCase()));
    const staticOnly = HOTELS.filter((h) => !dbNames.has(h.name.toLowerCase()));
    return [...dbCatalog, ...staticOnly];
}

exports.getLiveHotels = async (req, res) => {
    try {
        const currentTime = new Date();
        // Fluctuate prices based on time - changes every 30 seconds
        const timeSeed = Math.floor(currentTime.getTime() / 30000);
        const fluctFactor = Math.sin(timeSeed * 0.7 + 1.2);

        const { city, stars } = req.query;

        let filtered = await buildCatalog();
        if (city && city !== 'All') {
            filtered = filtered.filter(h => h.city.toLowerCase() === city.toLowerCase());
        }
        if (stars) {
            filtered = filtered.filter(h => h.stars === parseInt(stars));
        }

        const results = applyLivePricing(filtered, timeSeed, fluctFactor, currentTime);

        res.json({
            success: true,
            source: 'Live Hotel Feed',
            data: results,
            cities: CITIES,
            refreshInterval: 30000,
            timestamp: currentTime.toISOString(),
        });
    } catch (error) {
        console.error('Hotel live feed error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLiveHotelById = async (req, res) => {
    try {
        const catalog = await buildCatalog();
        let hotel = catalog.find(h => String(h.id) === String(req.params.id));
        if (!hotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }

        const currentTime = new Date();
        const timeSeed = Math.floor(currentTime.getTime() / 30000);
        const fluctFactor = Math.sin(timeSeed * 0.7 + 1.2);

        const [liveHotel] = applyLivePricing([hotel], timeSeed, fluctFactor, currentTime);

        res.json({
            success: true,
            data: liveHotel,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
