/**
 * Normalize hotel.images JSON from API (object with extras, legacy array, or null).
 */

export const DEFAULT_SERVICES = [
    '24/7 Front Desk',
    'Free Wi‑Fi',
    'Room service',
    'Housekeeping',
    'Parking',
];

export function parseHotelMeta(hotel) {
    if (!hotel) {
        return {
            city: 'Pakistan',
            roomsAvailable: 0,
            description: '',
            services: DEFAULT_SERVICES,
            gallery: [],
        };
    }

    let raw = hotel.images;
    if (typeof raw === 'string') {
        try {
            raw = JSON.parse(raw);
        } catch {
            raw = null;
        }
    }

    if (Array.isArray(raw)) {
        const rooms =
            Number(hotel.roomsAvailable) >= 0 ? Number(hotel.roomsAvailable) : 12;
        const services =
            Array.isArray(hotel.amenities) && hotel.amenities.length
                ? hotel.amenities
                : DEFAULT_SERVICES;
        return {
            city: hotel.city || 'Pakistan',
            roomsAvailable: rooms,
            description:
                hotel.description ||
                `${hotel.name} — comfortable stay with trusted hospitality.`,
            services,
            gallery: raw.filter(Boolean),
        };
    }

    if (raw && typeof raw === 'object') {
        return {
            city: raw.city || 'Pakistan',
            roomsAvailable: Number(raw.roomsAvailable) >= 0 ? Number(raw.roomsAvailable) : 12,
            description:
                raw.description ||
                `${hotel.name} in ${raw.city || 'Pakistan'}. Book for best available rates.`,
            services: Array.isArray(raw.services) && raw.services.length ? raw.services : DEFAULT_SERVICES,
            gallery: Array.isArray(raw.gallery) ? raw.gallery.filter(Boolean) : [],
        };
    }

    return {
        city: 'Pakistan',
        roomsAvailable: 12,
        description: `${hotel.name} — explore amenities and book your stay.`,
        services: DEFAULT_SERVICES,
        gallery: [],
    };
}
