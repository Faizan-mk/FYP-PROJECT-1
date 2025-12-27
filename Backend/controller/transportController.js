const { Transport } = require('../model');

// Get all transport options
exports.getAllTransport = async (req, res) => {
    try {
        const transport = await Transport.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(transport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get single transport by ID
exports.getTransportById = async (req, res) => {
    try {
        const transport = await Transport.findByPk(req.params.id);
        if (!transport) return res.status(404).json({ message: 'Transport not found' });
        res.json(transport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create transport (Admin only)
exports.createTransport = async (req, res) => {
    try {
        const transport = await Transport.create(req.body);
        res.status(201).json(transport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update transport (Admin only)
exports.updateTransport = async (req, res) => {
    try {
        const transport = await Transport.findByPk(req.params.id);
        if (!transport) return res.status(404).json({ message: 'Transport not found' });
        await transport.update(req.body);
        res.json(transport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete transport (Admin only)
exports.deleteTransport = async (req, res) => {
    try {
        const transport = await Transport.findByPk(req.params.id);
        if (!transport) return res.status(404).json({ message: 'Transport not found' });
        await transport.destroy();
        res.json({ message: 'Transport deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
