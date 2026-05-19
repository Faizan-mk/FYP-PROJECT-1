/**
 * External market pricing for tour cards.
 *
 * Pakistani OTA sites (FindMyAdventure, TripKar, Sastaticket, Bookme) do not publish
 * public REST APIs for package prices — you need partner/B2B access from each company.
 *
 * When AMADEUS_API_KEY + AMADEUS_API_SECRET are configured, we call Amadeus
 * Shopping Activities (by lat/lon) — real API prices (currency converted to PKR estimate).
 * Coverage in remote northern areas can be sparse; we always fall back to catalog logic.
 */

const Amadeus = require('amadeus');

const CACHE = new Map();
const DEFAULT_CACHE_MS = parseInt(process.env.TRAVEL_AMADEUS_CACHE_MS || '900000', 10);
const PKR_PER_EUR = parseFloat(process.env.PKR_PER_EUR || '305', 10);
const PKR_PER_USD = parseFloat(process.env.PKR_PER_USD || '280', 10);

/** Approximate centres for package destinations (Pakistan) — used for /v1/shopping/activities */
const DESTINATION_GEO = {
    'hunza-valley': { lat: 36.3167, lon: 74.65, radius: 65 },
    skardu: { lat: 35.2971, lon: 75.6334, radius: 80 },
    'naran-kaghan': { lat: 34.9086, lon: 73.6479, radius: 45 },
    'swat-valley': { lat: 34.791, lon: 72.3601, radius: 55 },
    'gwadar-beach': { lat: 25.1216, lon: 62.3254, radius: 70 },
    'karachi-seaview': { lat: 24.7931, lon: 67.0257, radius: 40 },
    'lahore-old-city': { lat: 31.5897, lon: 74.3105, radius: 35 },
    islamabad: { lat: 33.6844, lon: 73.0479, radius: 40 },
    'thar-desert': { lat: 25.396, lon: 69.7642, radius: 90 },
    'fairy-meadows': { lat: 35.3813, lon: 74.5175, radius: 50 },
};

function amadeusConfigured() {
    const k = process.env.AMADEUS_API_KEY || '';
    const s = process.env.AMADEUS_API_SECRET || '';
    if (!k || !s) return false;
    if (k === 'your_amadeus_api_key_here' || s === 'your_amadeus_api_secret_here') return false;
    return true;
}

function getAmadeus() {
    if (!amadeusConfigured()) return null;
    try {
        return new Amadeus({
            clientId: process.env.AMADEUS_API_KEY,
            clientSecret: process.env.AMADEUS_API_SECRET,
        });
    } catch {
        return null;
    }
}

function toPkr(amount, currencyCode) {
    const amt = typeof amount === 'string' ? parseFloat(amount, 10) : Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return null;
    const cur = String(currencyCode || 'EUR').toUpperCase();
    if (cur === 'PKR') return amt;
    if (cur === 'EUR') return amt * PKR_PER_EUR;
    if (cur === 'USD') return amt * PKR_PER_USD;
    if (cur === 'GBP') return amt * PKR_PER_USD * 1.27;
    return amt * PKR_PER_USD;
}

/**
 * @returns {Promise<{ avgPkr: number, minPkr: number, count: number } | null>}
 */
async function fetchAmadeusActivitiesAnchor({ lat, lon, radius }) {
    const client = getAmadeus();
    if (!client) return null;

    const res = await client.shopping.activities.get({
        latitude: lat,
        longitude: lon,
        radius: Math.min(100, Math.max(5, radius || 50)),
    });

    const rows = Array.isArray(res?.data) ? res.data : [];
    const pkrValues = [];

    for (const row of rows) {
        const price = row?.price;
        if (!price) continue;
        const amount = price.amount ?? price.total ?? price.base;
        const cur = price.currencyCode || price.currency;
        const pkr = toPkr(amount, cur);
        if (pkr != null && pkr > 0) pkrValues.push(pkr);
    }

    if (!pkrValues.length) return null;

    const minPkr = Math.min(...pkrValues);
    const avgPkr = pkrValues.reduce((a, b) => a + b, 0) / pkrValues.length;
    return {
        minPkr: Math.round(minPkr / 50) * 50,
        avgPkr: Math.round(avgPkr / 50) * 50,
        count: pkrValues.length,
    };
}

/**
 * Cached Amadeus anchor per destination_key.
 */
async function getAnchorForDestinationKey(destKey) {
    const geo = DESTINATION_GEO[destKey];
    if (!geo) return null;

    if (process.env.TRAVEL_USE_AMADEUS_PRICING === '0' || process.env.TRAVEL_USE_AMADEUS_PRICING === 'false') {
        return null;
    }

    const now = Date.now();
    const hit = CACHE.get(destKey);
    if (hit && now - hit.at < DEFAULT_CACHE_MS) {
        return hit.value;
    }

    let value = null;
    try {
        value = await fetchAmadeusActivitiesAnchor(geo);
    } catch (err) {
        console.warn(`[travelPackageExternalPricing] Amadeus activities failed for ${destKey}:`, err.message);
        value = null;
    }

    CACHE.set(destKey, { at: now, value });
    return value;
}

/**
 * @param {string[]} keys
 * @returns {Promise<Record<string, { avgPkr: number, minPkr: number, count: number } | null>>}
 */
async function getAnchorsForDestinationKeys(keys) {
    const uniq = [...new Set(keys.filter(Boolean))];
    const out = {};
    await Promise.all(
        uniq.map(async (k) => {
            out[k] = await getAnchorForDestinationKey(k);
        })
    );
    return out;
}

function externalPricingMeta() {
    return {
        amadeusConfigured: amadeusConfigured(),
        pakOtaPublicApis: false,
        note: 'FindMyAdventure / TripKar / Sastaticket / Bookme do not offer public package-price APIs; use Amadeus Activities (geo) when keys are set, or negotiate partner APIs.',
    };
}

module.exports = {
    DESTINATION_GEO,
    getAnchorsForDestinationKeys,
    getAnchorForDestinationKey,
    externalPricingMeta,
    amadeusConfigured,
};
