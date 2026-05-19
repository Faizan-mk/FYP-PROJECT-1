/**
 * Pakistan hotels catalog for traveler app seed.
 * Extra fields in `images` JSON: { city, roomsAvailable, description, services, gallery }
 */

const POOL = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1582719478250-4b895f3377a6?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1578680475863-3e8a82d79e44?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1544984803256-89294331c52f?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1597248881519-db089d3744e0?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1612423284934-2850a4ea4b25?auto=format&fit=crop&q=80&w=1200',
];

const pick = (i) => POOL[Math.abs(i) % POOL.length];

const hotel = (idx, name, city, price, stars, rating, rooms, services, desc, bookingUrl) => {
    const main = pick(idx);
    const g1 = pick(idx + 1);
    const g2 = pick(idx + 2);
    return {
        name,
        price,
        stars,
        rating,
        image: main,
        breakfast: true,
        wifi: true,
        bookingUrl,
        images: {
            city,
            roomsAvailable: rooms,
            description: desc,
            services,
            gallery: [g1, g2],
        },
    };
};

const PAK_HOTELS = [
    hotel(0, 'Pearl Continental Karachi', 'Karachi', 28500, 5, 4.6, 32, ['24/7 Front Desk', 'Free Wi‑Fi', 'Pool', 'Spa', 'Gym', 'Room service', 'Parking', 'Airport shuttle'], 'Sea-facing luxury in the heart of Karachi.', 'https://www.pchotels.com/hotels/pc-karachi'),
    hotel(1, 'Avari Towers Karachi', 'Karachi', 22000, 5, 4.5, 24, ['Business centre', 'Wi‑Fi', 'Rooftop pool', 'Gym', 'Multiple restaurants', 'Laundry'], 'Iconic tower stay near Clifton and beaches.', 'https://www.avari.com/property/avari-towers-karachi/'),
    hotel(2, 'Mövenpick Hotel Karachi', 'Karachi', 19500, 4, 4.3, 18, ['Swiss hospitality', 'Wi‑Fi', 'Breakfast buffet', 'Meeting rooms', 'Airport transfer'], 'International standards near airport corridor.', 'https://www.movenpick.com/en/asia/pakistan/karachi/overview.html'),
    hotel(3, 'Ramada by Wyndham Karachi', 'Karachi', 12500, 4, 4.1, 42, ['Wi‑Fi', 'Pool', 'Gym', 'Coffee shop', 'Parking'], 'Comfortable mid-range option for families.', 'https://www.wyndhamhotels.com/ramada'),
    hotel(4, 'Marriott Karachi', 'Karachi', 35000, 5, 4.7, 15, ['Luxury rooms', 'Executive lounge', 'Spa', 'Fine dining', 'Concierge', 'Valet parking'], 'Premium business and leisure destination.', 'https://www.marriott.com'),

    hotel(5, 'Pearl Continental Lahore', 'Lahore', 26500, 5, 4.6, 28, ['Pool', 'Spa', 'Gym', 'Wi‑Fi', 'Banquet halls', 'Garden café'], 'Near Mall Road and cultural landmarks.', 'https://www.pchotels.com/hotels/pc-lahore'),
    hotel(6, 'Avari Lahore', 'Lahore', 18500, 4, 4.4, 22, ['Wi‑Fi', 'Rooftop dining', 'Gym', 'Business centre', 'Laundry'], 'Central location for food and heritage tours.', 'https://www.avari.com/property/avari-lahore/'),
    hotel(7, 'Nishat Hotel Johar Town', 'Lahore', 14500, 4, 4.2, 35, ['Wi‑Fi', 'Breakfast', 'Meeting rooms', 'Parking'], 'Modern stay in Johar Town commercial hub.', 'https://www.nishathotel.com'),
    hotel(8, 'Luxus Grand Hotel Lahore', 'Lahore', 12000, 4, 4.0, 30, ['Wi‑Fi', 'Restaurant', '24h reception', 'Airport pickup'], 'Boutique comfort with local flavour.', 'https://www.luxusgrand.com'),
    hotel(9, 'Faletti\'s Hotel Lahore', 'Lahore', 11000, 4, 4.3, 20, ['Heritage building', 'Wi‑Fi', 'Traditional dining', 'Courtyard'], 'Historic colonial-era charm.', 'https://www.falettishotel.com'),

    hotel(10, 'Serena Hotel Islamabad', 'Islamabad', 32000, 5, 4.8, 20, ['Diplomatic enclave access', 'Spa', 'Fine dining', 'Wi‑Fi', 'Tennis', 'Concierge'], 'Flagship luxury in the capital.', 'https://www.serenahotels.com/islamabad'),
    hotel(11, 'Islamabad Marriott Hotel', 'Islamabad', 29500, 5, 4.6, 18, ['Pool', 'Gym', 'Executive floors', 'Wi‑Fi', 'Multiple restaurants'], 'International business traveller favourite.', 'https://www.marriott.com'),
    hotel(12, 'Hotel One Islamabad', 'Islamabad', 9500, 3, 4.0, 45, ['Wi‑Fi', 'Breakfast', 'Parking', '24h desk'], 'Reliable budget-friendly chain.', 'https://www.hotelone.com.pk'),
    hotel(13, 'Envoy Continental Hotel', 'Islamabad', 8800, 3, 3.9, 38, ['Wi‑Fi', 'Restaurant', 'Laundry'], 'Near Blue Area and offices.', 'https://www.booking.com/searchresults.html?ss=Islamabad'),
    hotel(14, 'Grand Islamabad Hotel', 'Islamabad', 13500, 4, 4.2, 26, ['Wi‑Fi', 'Gym', 'Conference rooms', 'Coffee shop'], 'Comfortable mid-scale in F-7 sector.', 'https://www.booking.com/searchresults.html?ss=Islamabad'),

    hotel(15, 'Pearl Continental Rawalpindi', 'Rawalpindi', 15500, 4, 4.3, 24, ['Wi‑Fi', 'Restaurant', 'Parking', 'Meeting rooms'], 'Close to Saddar and metro links.', 'https://www.pchotels.com'),
    hotel(16, 'Flashman\'s Hotel Rawalpindi', 'Rawalpindi', 7500, 3, 3.8, 30, ['Wi‑Fi', 'Restaurant', 'Heritage views'], 'Classic hill station road base.', 'https://www.booking.com/searchresults.html?ss=Rawalpindi'),

    hotel(17, 'Serena Hotel Multan', 'Multan', 17500, 4, 4.4, 22, ['Wi‑Fi', 'Pool', 'Garden', 'Local cuisine', 'Spa'], 'Oasis style in the city of saints.', 'https://www.serenahotels.com'),
    hotel(18, 'Hotel One Multan', 'Multan', 7200, 3, 3.9, 40, ['Wi‑Fi', 'Breakfast', 'Parking'], 'Practical stay near city centre.', 'https://www.hotelone.com.pk'),

    hotel(19, 'Serena Hotel Peshawar', 'Peshawar', 16500, 4, 4.3, 18, ['Wi‑Fi', 'Security', 'Restaurant', 'Garden'], 'Secure upscale stay in Khyber Pakhtunkhwa.', 'https://www.serenahotels.com'),
    hotel(20, 'Pearl Continental Peshawar', 'Peshawar', 14200, 4, 4.1, 20, ['Wi‑Fi', 'Gym', 'Banquet', 'Parking'], 'Business and family friendly.', 'https://www.pchotels.com'),

    hotel(21, 'Quetta Serena Hotel', 'Quetta', 14800, 4, 4.2, 16, ['Wi‑Fi', 'Heating', 'Restaurant', 'Parking'], 'Comfort in the highland capital.', 'https://www.serenahotels.com'),
    hotel(22, 'Bloomstar Hotel Quetta', 'Quetta', 6500, 3, 3.7, 28, ['Wi‑Fi', 'Breakfast', '24h desk'], 'Economical city centre option.', 'https://www.booking.com/searchresults.html?ss=Quetta'),

    hotel(23, 'PC Gwadar', 'Gwadar', 19500, 4, 4.2, 14, ['Sea views', 'Wi‑Fi', 'Restaurant', 'Generator backup'], 'Coastal gateway to the Arabian Sea.', 'https://www.pchotels.com'),
    hotel(24, 'Marina View Hotel Gwadar', 'Gwadar', 11000, 3, 3.9, 22, ['Wi‑Fi', 'Sea breeze café', 'Parking'], 'Budget sea-view rooms.', 'https://www.booking.com/searchresults.html?ss=Gwadar'),

    hotel(25, 'Pearl Continental Bhurban', 'Murree Hills', 21000, 4, 4.5, 20, ['Mountain views', 'Wi‑Fi', 'Bonfire area', 'Heating'], 'Hill retreat near Murree.', 'https://www.pchotels.com'),
    hotel(26, 'Shangrila Resort Skardu', 'Skardu', 18500, 4, 4.6, 12, ['Mountain lodge', 'Wi‑Fi', 'Local tours', 'Restaurant'], 'Gateway to Deosai and K2 treks.', 'https://www.booking.com/searchresults.html?ss=Skardu'),
    hotel(27, 'Hunza Serena Inn', 'Hunza', 22000, 4, 4.7, 10, ['Rakaposhi views', 'Wi‑Fi', 'Organic meals', 'Guided hikes'], 'Boutique inn in Karimabad.', 'https://www.serenahotels.com'),
    hotel(28, 'Fairy Meadows Cottages', 'Fairy Meadows', 8500, 3, 4.4, 8, ['Wood cabins', 'Meals included', 'Trek support', 'Evening generator'], 'Rustic stay under Nanga Parbat.', 'https://www.booking.com/searchresults.html?ss=Fairy+Meadows'),
    hotel(29, 'Naran Hotel One', 'Naran Kaghan', 7800, 3, 4.0, 25, ['River nearby', 'Wi‑Fi', 'Parking', 'Heating'], 'Summer valley base camp.', 'https://www.hotelone.com.pk'),
    hotel(30, 'Swat Serena Hotel', 'Mingora (Swat)', 16000, 4, 4.4, 18, ['Garden', 'Wi‑Fi', 'Local crafts shop', 'Restaurant'], 'Green Swat valley hospitality.', 'https://www.serenahotels.com'),
    hotel(31, 'Faisalabad Serena Hotel', 'Faisalabad', 12500, 4, 4.1, 24, ['Wi‑Fi', 'Gym', 'Conference', 'Parking'], 'Industrial hub premium stay.', 'https://www.serenahotels.com'),
    hotel(32, 'Hyderabad Indus Hotel', 'Hyderabad', 6200, 3, 3.8, 34, ['Wi‑Fi', 'AC rooms', 'Restaurant'], 'Stopover on Indus highway route.', 'https://www.booking.com/searchresults.html?ss=Hyderabad+Pakistan'),
    hotel(33, 'Sukkur Inn Hotel', 'Sukkur', 5500, 3, 3.7, 30, ['Wi‑Fi', 'Breakfast', 'Parking'], 'Business travel along N-5.', 'https://www.booking.com/searchresults.html?ss=Sukkur'),
    hotel(34, 'Gilgit Riveria Hotel', 'Gilgit', 9200, 3, 4.1, 16, ['Wi‑Fi', 'Rooftop views', 'Tour desk'], 'Jump-off for Hunza and Khunjerab.', 'https://www.booking.com/searchresults.html?ss=Gilgit'),
];

module.exports = { PAK_HOTELS };
