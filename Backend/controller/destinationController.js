const { Destination } = require('../model');

exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        res.json(destinations);
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
