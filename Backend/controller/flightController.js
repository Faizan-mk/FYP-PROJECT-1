const { Flight } = require('../model');

// Get all flights (available to all users)
exports.getAllFlights = async (req, res) => {
    try {
        const { from, to } = req.query;
        const where = {};
        if (from) where.from = from;
        if (to) where.to = to;

        const flights = await Flight.findAll({
            where,
            order: [['departure', 'ASC']]
        });
        res.json(flights);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get single flight by ID
exports.getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findByPk(req.params.id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.json(flight);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create flight (admin only)
exports.createFlight = async (req, res) => {
    try {
        const flight = await Flight.create(req.body);
        res.status(201).json(flight);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update flight (admin only)
exports.updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findByPk(req.params.id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        await flight.update(req.body);
        res.json(flight);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete flight (admin only)
exports.deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findByPk(req.params.id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        await flight.destroy();
        res.json({ message: 'Flight deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
