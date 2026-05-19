const os = require('os');

/** First non-internal IPv4 (Wi‑Fi / Ethernet) for phone testing on same network. */
function getLanIp() {
    const nets = os.networkInterfaces();
    for (const ifaces of Object.values(nets)) {
        for (const net of ifaces || []) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return null;
}

/**
 * Base URL for links in emails (reset password, etc.).
 * localhost only works on the same PC — phones need your LAN IP (e.g. 192.168.1.5:5173).
 */
function getFrontendBaseUrl() {
    const port = String(process.env.FRONTEND_PORT || '5173').trim();
    const explicit = String(process.env.FRONTEND_URL || '').trim().replace(/\/+$/, '');

    if (explicit && !/localhost|127\.0\.0\.1/i.test(explicit)) {
        return explicit;
    }

    const lanIp = String(process.env.FRONTEND_LAN_IP || '').trim() || getLanIp();
    const useLan =
        process.env.RESET_LINK_USE_LAN === 'true' ||
        process.env.RESET_LINK_USE_LAN === '1' ||
        process.env.NODE_ENV !== 'production';

    if (useLan && lanIp) {
        return `http://${lanIp}:${port}`;
    }

    return explicit || `http://localhost:${port}`;
}

function logFrontendUrlHint() {
    const base = getFrontendBaseUrl();
    const lan = getLanIp();
    console.log(`🔗 Password reset links use: ${base}`);
    if (lan && base.includes('localhost')) {
        console.log(
            `📱 Phone cannot open localhost. Set in Backend/.env:\n` +
                `   FRONTEND_URL=http://${lan}:${process.env.FRONTEND_PORT || '5173'}\n` +
                `   (Phone and laptop must be on the same Wi‑Fi; run frontend with: npm run dev)`
        );
    } else if (lan) {
        console.log(`📱 Open on phone (same Wi‑Fi): ${base}`);
    }
}

module.exports = { getFrontendBaseUrl, getLanIp, logFrontendUrlHint };
