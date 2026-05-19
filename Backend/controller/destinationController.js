const { Destination } = require('../model');
const { Op } = require('sequelize');

const parseLimit = (value, fallback = 6, max = 50) => {
    const n = parseInt(value, 10);
    if (!Number.isFinite(n) || n < 1) return fallback;
    return Math.min(n, max);
};

exports.getPopularDestinations = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit, 6);
        const destinations = await Destination.findAll({
            limit,
            order: [['createdAt', 'DESC']],
        });
        res.json(destinations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getForYouDestinations = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit, 6);
        const types = String(req.query.types || '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        const exclude = String(req.query.exclude || '')
            .split(',')
            .map((n) => n.trim())
            .filter(Boolean);

        const where = {};
        if (types.length) where.type = { [Op.in]: types };
        if (exclude.length) where.name = { [Op.notIn]: exclude };

        const destinations = await Destination.findAll({
            where,
            limit,
            order: [['createdAt', 'DESC']],
        });

        res.json({
            data: destinations,
            profile: {
                types: types.length ? types : ['mixed'],
                reason: types.length
                    ? `Based on your interest in ${types.join(', ')}`
                    : 'Popular destinations for you',
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getDestinationSuggestions = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit, 8);
        const q = String(req.query.q || '').trim();
        const types = String(req.query.types || '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        const exclude = String(req.query.exclude || '')
            .split(',')
            .map((n) => n.trim())
            .filter(Boolean);

        const where = {};
        if (types.length) where.type = { [Op.in]: types };
        if (q && exclude.length) {
            where.name = { [Op.and]: [{ [Op.like]: `%${q}%` }, { [Op.notIn]: exclude }] };
        } else if (q) {
            where.name = { [Op.like]: `%${q}%` };
        } else if (exclude.length) {
            where.name = { [Op.notIn]: exclude };
        }

        const destinations = await Destination.findAll({
            where,
            limit,
            order: [['name', 'ASC']],
        });
        res.json(destinations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllDestinations = async (req, res) => {
    try {
        const { search } = req.query;
        let whereClause = {};

        if (search) {
            whereClause.name = {
                [Op.like]: `%${search}%`
            };
        }

        const destinations = await Destination.findAll({
            where: whereClause
        });
        res.json(destinations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findByPk(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        res.json(destination);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createDestination = async (req, res) => {
    try {
        const { name, type, weather, image } = req.body;
        const destination = await Destination.create({
            name,
            type,
            weather,
            image
        });
        res.status(201).json(destination);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, weather, image } = req.body;
        const destination = await Destination.findByPk(id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        await destination.update({ name, type, weather, image });
        res.json(destination);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await Destination.findByPk(id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        await destination.destroy();
        res.json({ message: 'Destination deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
