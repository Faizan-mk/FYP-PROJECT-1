const { Op } = require('sequelize');
const { TravelPackage, TravelAgency } = require('../model/travelPackageIndex');
const {
    getAnchorsForDestinationKeys,
    externalPricingMeta,
} = require('../services/travelPackageExternalPricing');

/** Live PKR offers: recomputed on every API request; slot advances every ~30s so polling shows fresh numbers. */
function computeLivePricing(basePrice, packageId, now = new Date()) {
    const slot = Math.floor(now.getTime() / (30 * 1000));
    let hash = 0;
    const pid = String(packageId || '');
    for (let i = 0; i < pid.length; i += 1) {
        hash = (hash * 31 + pid.charCodeAt(i)) | 0;
    }
    const mix = (Math.abs(hash + slot * 9973) % 1000) / 1000;
    const hour = now.getHours();

    let discount = 0;
    let offerLabel = null;

    if (mix < 0.22) {
        discount = Math.round(6 + mix * 18);
        offerLabel = 'Live flash offer';
    } else if (mix < 0.38) {
        discount = Math.round(10 + mix * 12);
        offerLabel = 'Agency promo';
    } else if (mix < 0.48) {
        discount = Math.round(4 + mix * 8);
        offerLabel = 'Limited seats';
    }

    if (hour >= 14 && hour < 19 && hash % 5 === 0) {
        discount = Math.max(discount, 14);
        offerLabel = offerLabel || 'Afternoon special';
    }

    const floor = Math.round(basePrice * 0.82);
    const raw = basePrice * (1 - discount / 100);
    let current = Math.round(raw / 100) * 100;
    current = Math.max(current, Math.round(floor / 100) * 100);

    return {
        basePricePKR: basePrice,
        currentPricePKR: current,
        discountPercent: discount,
        offerLabel,
    };
}

function pricingFromAmadeusBlend(basePrice, durationDays, packageId, anchor) {
    const duration = Math.max(1, Number(durationDays) || 4);
    const durationWeight = Math.min(2, 0.45 + duration * 0.11);
    const apiScaled = Math.round((anchor.avgPkr * durationWeight) / 100) * 100;
    const blended = Math.round((basePrice * 0.38 + apiScaled * 0.62) / 100) * 100;
    const capLow = Math.round((basePrice * 0.7) / 100) * 100;
    const capHigh = Math.round((basePrice * 1.08) / 100) * 100;
    let current = Math.min(Math.max(blended, capLow), capHigh);

    const jit = computeLivePricing(basePrice, packageId);
    if (jit.discountPercent > 0 && current < basePrice) {
        const bump =
            Math.round((current * (1 - Math.min(12, jit.discountPercent) / 100)) / 100) * 100;
        current = Math.max(bump, capLow);
    }

    const discountPercent =
        current < basePrice ? Math.min(35, Math.round((1 - current / basePrice) * 100)) : 0;
    return {
        basePricePKR: basePrice,
        currentPricePKR: current,
        discountPercent,
        offerLabel: discountPercent > 0 ? 'Amadeus area + offer' : 'Amadeus area rate',
        pricingSource: 'amadeus_activities+catalog',
        amadeusActivitySamples: anchor.count,
    };
}

function serializePackage(row, agencyJson, anchor) {
    const p = row.toJSON ? row.toJSON() : row;
    const ag = agencyJson || p.TravelAgency || {};
    const agency = {
        id: ag.id,
        code: ag.code,
        name: ag.name,
        websiteUrl: ag.website_url,
    };

    const base = p.base_price_pkr;
    let pricing;

    if (anchor && anchor.count > 0) {
        pricing = pricingFromAmadeusBlend(base, p.duration_days, p.id, anchor);
    } else {
        pricing = {
            ...computeLivePricing(base, p.id),
            pricingSource: 'catalog_simulated',
            amadeusActivitySamples: 0,
        };
    }

    return {
        id: p.id,
        destinationName: p.destination_name,
        destinationKey: p.destination_key,
        imageUrl: p.image_url,
        packageType: p.package_type,
        groupSize: p.group_size,
        title: p.title,
        durationDays: p.duration_days,
        ...pricing,
        agency,
        /** Same-origin in dev (Vite proxy) and typical single-host deploys */
        bookViaAppUrl: `/api/redirect/travel-package/${encodeURIComponent(p.id)}`,
        agencyWebsiteUrl: p.booking_url_override || ag.website_url,
    };
}

exports.listPackages = async (req, res) => {
    try {
        const destination = (req.query.destination && String(req.query.destination).trim()) || '';
        const type = (req.query.type && String(req.query.type).trim().toLowerCase()) || '';
        const limitRaw = req.query.limit != null ? parseInt(String(req.query.limit), 10) : 48;
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 48;

        const where = { is_active: true };
        if (['solo', 'group', 'family'].includes(type)) {
            where.package_type = type;
        }
        if (destination) {
            const keyGuess = destination
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            where[Op.or] = [
                { destination_name: { [Op.like]: `%${destination}%` } },
                { destination_key: { [Op.like]: `%${keyGuess}%` } },
            ];
        }

        const rows = await TravelPackage.findAll({
            where,
            include: [{ model: TravelAgency, where: { is_active: true }, required: true }],
            order: [
                ['destination_name', 'ASC'],
                ['package_type', 'ASC'],
                ['base_price_pkr', 'ASC'],
            ],
            limit,
        });

        const destKeys = rows.map((r) => r.destination_key).filter(Boolean);
        const anchors = await getAnchorsForDestinationKeys(destKeys);
        const data = rows.map((r) => serializePackage(r, null, anchors[r.destination_key] || null));

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.set('Pragma', 'no-cache');

        return res.json({
            success: true,
            fetchedAt: new Date().toISOString(),
            pollIntervalMs: 30000,
            count: data.length,
            data,
            pricing: externalPricingMeta(),
        });
    } catch (err) {
        console.error('listPackages:', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.redirectToAgency = async (req, res) => {
    try {
        const id = req.params.id;
        const pkg = await TravelPackage.findByPk(id, {
            include: [{ model: TravelAgency, required: false }],
        });

        if (!pkg || !pkg.is_active) {
            return res.redirect(302, 'https://www.google.com/search?q=Pakistan+travel+packages');
        }

        const ag = pkg.TravelAgency;
        const target =
            pkg.booking_url_override ||
            (ag && ag.website_url) ||
            'https://www.google.com/search?q=Pakistan+travel+packages';

        return res.redirect(302, target);
    } catch (err) {
        console.error('redirectToAgency:', err.message);
        return res.redirect(302, 'https://www.google.com/search?q=Pakistan+travel+packages');
    }
};
