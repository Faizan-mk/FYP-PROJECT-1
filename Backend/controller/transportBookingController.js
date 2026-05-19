const { TransportBooking } = require('../model');
const { createNotification } = require('./notificationController');

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await TransportBooking.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.createBooking = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const booking = await TransportBooking.create({
            ...req.body,
            userId,
        });

        await createNotification(
            userId,
            'Trip',
            '🚌',
            'Transport booking saved',
            `${booking.from || req.body.from || 'Origin'} → ${booking.to || req.body.to || 'Destination'} — ${booking.provider || req.body.provider || 'Transport'}.`
        );

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await TransportBooking.findByPk(req.params.id);
        if (booking) {
            await booking.update({ status: 'cancelled' });
            res.json(booking);
        } else res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        await TransportBooking.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
