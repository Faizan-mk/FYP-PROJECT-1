const { TransportCompany, TransportRoute, TransportClick } = require('../model/pakTransportIndex');
const { Op } = require('sequelize');

// ─── Dynamic pricing engine ───────────────────────────────────────────────────
// Simulates real-world demand-based pricing (peak hours = higher prices)
function getDynamicPrice(basePrice, departureTime) {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Peak hour surcharge: morning (7-10am) & evening (5-9pm)
    let multiplier = 1.0;
    if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 21)) {
        multiplier = 1.15; // 15% peak surcharge
    } else if (hour >= 22 || hour <= 5) {
        multiplier = 0.92; // 8% off-peak discount
    }

    // Small random fluctuation (±3%) for live feel
    const rand = 0.97 + Math.random() * 0.06;

    // Round to nearest 50 PKR
    const dynamic = Math.round((basePrice * multiplier * rand) / 50) * 50;
    return Math.max(dynamic, Math.round(basePrice * 0.85)); // never drop below 85% of base
}

// ─── Realistic seat availability ─────────────────────────────────────────────
function getAvailableSeats(total, departureTime) {
    const hour = new Date().getHours();
    // Seats fill up as the day progresses
    const fillRate = Math.min(0.85, (hour / 24) * 0.7 + Math.random() * 0.3);
    const booked = Math.floor(total * fillRate);
    return Math.max(1, total - booked);
}

// ─── GET /api/transport/companies ────────────────────────────────────────────
exports.getCompanies = async (req, res) => {
    try {
        const companies = await TransportCompany.findAll({
            where: { isActive: true },
            order: [['type', 'ASC'], ['name', 'ASC']],
        });

        // Enrich with live stats
        const enriched = await Promise.all(companies.map(async (c) => {
            const routeCount = await TransportRoute.count({
                where: { company_id: c.id, isActive: true }
            });
            return {
                ...c.toJSON(),
                total_routes: routeCount,
                live_status: 'operational',
                last_updated: new Date().toISOString(),
            };
        }));

        return res.json({
            success: true,
            count: enriched.length,
            data: enriched,
            fetched_at: new Date().toISOString(),
        });
    } catch (err) {
        console.error('getCompanies error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/transport/search ───────────────────────────────────────────────
exports.searchRoutes = async (req, res) => {
    try {
        const { companyCode, from, to, date, passengers } = req.query;

        if (!companyCode) {
            return res.status(400).json({ success: false, message: 'companyCode is required' });
        }

        const company = await TransportCompany.findOne({
            where: { code: companyCode.toUpperCase(), isActive: true }
        });
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        // Build search filters
        const where = { company_id: company.id, isActive: true };
        if (from && from.trim()) {
            where.from_city = { [Op.like]: `%${from.trim()}%` };
        }
        if (to && to.trim()) {
            where.to_city = { [Op.like]: `%${to.trim()}%` };
        }

        const routes = await TransportRoute.findAll({
            where,
            order: [['departure_time', 'ASC']],
        });

        const pax = parseInt(passengers) || 1;

        // Apply dynamic pricing and availability
        const data = routes.map(r => {
            const dynamicPrice = getDynamicPrice(r.price, r.departure_time);
            const seatsAvail = getAvailableSeats(r.seats_total || 44, r.departure_time);
            const urgency = seatsAvail <= 5 ? 'critical' : seatsAvail <= 12 ? 'low' : 'available';

            return {
                ...r.toJSON(),
                company_name: company.name,
                company_logo: company.logo,
                company_code: company.code,
                company_type: company.type,
                company_website: company.website,
                // Dynamic pricing
                base_price: r.price,
                display_price: dynamicPrice,
                total_price: dynamicPrice * pax,
                // Availability
                seats_available: seatsAvail,
                seats_total: r.seats_total || 44,
                availability: urgency,
                // Redirect
                redirect_url: `/api/redirect/transport/${r.id}`,
                // Live metadata
                fetched_at: new Date().toISOString(),
            };
        });

        // Filter by minimum seats if passengers > 1
        const filtered = pax > 1 ? data.filter(r => r.seats_available >= pax) : data;

        return res.json({
            success: true,
            company: company.toJSON(),
            count: filtered.length,
            passengers: pax,
            data: filtered,
            search_params: { from: from || null, to: to || null, date: date || null },
            fetched_at: new Date().toISOString(),
        });
    } catch (err) {
        console.error('searchRoutes error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/transport/all-routes ───────────────────────────────────────────
exports.getAllRoutes = async (req, res) => {
    try {
        const { from, to, type } = req.query;

        const companyWhere = { isActive: true };
        if (type && type !== 'all') companyWhere.type = type;

        const companies = await TransportCompany.findAll({ where: companyWhere });
        const companyIds = companies.map(c => c.id);

        const routeWhere = { company_id: { [Op.in]: companyIds }, isActive: true };
        if (from && from.trim()) routeWhere.from_city = { [Op.like]: `%${from.trim()}%` };
        if (to && to.trim()) routeWhere.to_city = { [Op.like]: `%${to.trim()}%` };

        const routes = await TransportRoute.findAll({
            where: routeWhere,
            order: [['price', 'ASC']],
        });

        const companyMap = {};
        companies.forEach(c => companyMap[c.id] = c);

        const data = routes.map(r => {
            const company = companyMap[r.company_id];
            const dynamicPrice = getDynamicPrice(r.price, r.departure_time);
            const seatsAvail = getAvailableSeats(r.seats_total || 44, r.departure_time);
            const urgency = seatsAvail <= 5 ? 'critical' : seatsAvail <= 12 ? 'low' : 'available';

            return {
                ...r.toJSON(),
                company_name: company?.name,
                company_logo: company?.logo,
                company_code: company?.code,
                company_type: company?.type,
                company_website: company?.website,
                base_price: r.price,
                display_price: dynamicPrice,
                seats_available: seatsAvail,
                availability: urgency,
                redirect_url: `/api/redirect/transport/${r.id}`,
                fetched_at: new Date().toISOString(),
            };
        });

        return res.json({
            success: true,
            count: data.length,
            data,
            fetched_at: new Date().toISOString(),
        });
    } catch (err) {
        console.error('getAllRoutes error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/redirect/transport/:id ─────────────────────────────────────────
exports.redirectToCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const route = await TransportRoute.findByPk(id, {
            include: [{ model: TransportCompany, as: 'company' }]
        });

        if (!route || !route.company) {
            return res.status(404).json({ success: false, message: 'Route or Company not found' });
        }

        // Track the click for analytics
        await TransportClick.create({
            route_id: route.id,
            ip_address: req.ip || req.headers['x-forwarded-for'] || null,
            user_agent: req.headers['user-agent'] || null,
        });

        // Determine the ultimate destination URL
        // Prioritize the specific route booking URL if it exists, otherwise use company website
        const targetUrl = route.real_redirect_url || route.company.website;

        if (!targetUrl) {
            console.error(`❌ No redirect URL found for route ${id}`);
            return res.status(404).json({ success: false, message: 'No redirect URL found' });
        }

        // Redirect to the company's booking page or website
        console.log(`🔗 Redirecting to ${route.company.name}: ${targetUrl}`);
        return res.redirect(302, targetUrl);
    } catch (err) {
        console.error('redirectToCompany error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
