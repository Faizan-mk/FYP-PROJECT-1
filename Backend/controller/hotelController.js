const { Hotel } = require('../model');

// Get all hotels (available to all users)
exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.findAll({
            order: [['name', 'ASC']]
        });
        res.json(hotels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get single hotel by ID
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json(hotel);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create hotel (admin only)
exports.createHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body);
        res.status(201).json(hotel);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update hotel (admin only)
exports.updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        await hotel.update(req.body);
        res.json(hotel);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete hotel (admin only)
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        await hotel.destroy();
        res.json({ message: 'Hotel deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
