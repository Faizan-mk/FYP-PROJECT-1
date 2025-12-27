const { Airline } = require('../model');

// Get all airlines (available to all users)
exports.getAllAirlines = async (req, res) => {
    try {
        const airlines = await Airline.findAll({
            order: [['name', 'ASC']]
        });
        res.json(airlines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get single airline by ID
exports.getAirlineById = async (req, res) => {
    try {
        const airline = await Airline.findByPk(req.params.id);
        if (!airline) {
            return res.status(404).json({ message: 'Airline not found' });
        }
        res.json(airline);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create airline (admin only)
exports.createAirline = async (req, res) => {
    try {
        const airline = await Airline.create(req.body);
        res.status(201).json(airline);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update airline (admin only)
exports.updateAirline = async (req, res) => {
    try {
        const airline = await Airline.findByPk(req.params.id);
        if (!airline) {
            return res.status(404).json({ message: 'Airline not found' });
        }
        await airline.update(req.body);
        res.json(airline);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete airline (admin only)
exports.deleteAirline = async (req, res) => {
    try {
        const airline = await Airline.findByPk(req.params.id);
        if (!airline) {
            return res.status(404).json({ message: 'Airline not found' });
        }
        await airline.destroy();
        res.json({ message: 'Airline deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
