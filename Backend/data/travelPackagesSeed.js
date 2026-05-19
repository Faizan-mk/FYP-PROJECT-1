/**
 * Tour catalog: solo / group (3 guests) / family bundles per destination × agency.
 * Prices are PKR list anchors; live endpoint applies time-based offers.
 */

/** Pakistan-based tour & travel operators (booking links point to official sites). */
const AGENCIES = [
    { code: 'FMA', name: 'Find My Adventure', website_url: 'https://findmyadventure.pk' },
    { code: 'TKR', name: 'TripKar (Pakistan)', website_url: 'https://tripkar.com' },
    { code: 'SST', name: 'Sastaticket.pk', website_url: 'https://www.sastaticket.pk' },
    { code: 'BKM', name: 'Bookme.pk', website_url: 'https://www.bookme.pk' },
];

/**
 * High-impact hero imagery (1600w) for package cards — landscape / city / coast / desert moods.
 */
const DESTINATIONS = [
    {
        name: 'Hunza Valley',
        key: 'hunza-valley',
        image:
            'https://images.unsplash.com/photo-1626624803524-d813798f0fe9?w=1600&q=88&auto=format&fit=crop',
        soloBase: 52000,
        days: 6,
    },
    {
        name: 'Skardu',
        key: 'skardu',
        image:
            'https://images.unsplash.com/photo-1549880181-56a44cf4a2a5?w=1600&q=88&auto=format&fit=crop',
        soloBase: 58000,
        days: 7,
    },
    {
        name: 'Naran Kaghan',
        key: 'naran-kaghan',
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=88&auto=format&fit=crop',
        soloBase: 42000,
        days: 5,
    },
    {
        name: 'Swat Valley',
        key: 'swat-valley',
        image:
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=88&auto=format&fit=crop',
        soloBase: 41000,
        days: 5,
    },
    {
        name: 'Gwadar Beach',
        key: 'gwadar-beach',
        image:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=88&auto=format&fit=crop',
        soloBase: 49000,
        days: 5,
    },
    {
        name: 'Karachi Seaview',
        key: 'karachi-seaview',
        image:
            'https://images.unsplash.com/photo-1529252574967-d937834fdb16?w=1600&q=88&auto=format&fit=crop',
        soloBase: 38000,
        days: 4,
    },
    {
        name: 'Lahore (Old City)',
        key: 'lahore-old-city',
        image:
            'https://images.unsplash.com/photo-1580212200469-bc497a44794d?w=1600&q=88&auto=format&fit=crop',
        soloBase: 35000,
        days: 4,
    },
    {
        name: 'Islamabad',
        key: 'islamabad',
        image:
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1600&q=88&auto=format&fit=crop',
        soloBase: 32000,
        days: 3,
    },
    {
        name: 'Thar Desert',
        key: 'thar-desert',
        image:
            'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1600&q=88&auto=format&fit=crop',
        soloBase: 44000,
        days: 4,
    },
    {
        name: 'Fairy Meadows',
        key: 'fairy-meadows',
        image:
            'https://images.unsplash.com/photo-1493246507139-2e8f87773304?w=1600&q=88&auto=format&fit=crop',
        soloBase: 56000,
        days: 6,
    },
];

function typeLabel(pt) {
    if (pt === 'solo') return 'Solo';
    if (pt === 'group') return 'Group (3 guests)';
    return 'Family (2A + 2C)';
}

function buildPackages() {
    const rows = [];
    const agencies = ['FMA', 'TKR', 'SST', 'BKM'];
    for (const dest of DESTINATIONS) {
        for (const agencyCode of agencies) {
            const bump =
                { FMA: 1.0, TKR: 0.97, SST: 1.01, BKM: 1.02 }[agencyCode] ?? 1.0;
            const solo = Math.round((dest.soloBase * bump) / 500) * 500;
            const group = Math.round((solo * 2.25) / 500) * 500;
            const family = Math.round((solo * 2.85) / 500) * 500;

            const types = [
                { package_type: 'solo', group_size: null, price: solo },
                { package_type: 'group', group_size: 3, price: group },
                { package_type: 'family', group_size: 4, price: family },
            ];

            for (const t of types) {
                rows.push({
                    agencyCode,
                    destination_name: dest.name,
                    destination_key: dest.key,
                    image_url: dest.image,
                    package_type: t.package_type,
                    group_size: t.group_size,
                    title: `${dest.days}D ${dest.name.split('(')[0].trim()} — ${typeLabel(t.package_type)}`,
                    duration_days: dest.days,
                    base_price_pkr: t.price,
                });
            }
        }
    }
    return rows;
}

module.exports = { AGENCIES, buildPackages, DESTINATIONS };
