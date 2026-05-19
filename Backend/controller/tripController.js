const Trip = require('../model/Trip');
const { createNotification } = require('./notificationController');

exports.createTrip = async (req, res) => {
    try {
        const { destination, startDate, endDate, budget, travelers, tripType } = req.body;
        const trip = await Trip.create({
            destination,
            startDate,
            endDate,
            budget,
            travelers,
            tripType,
            UserId: req.user.id,
        });

        // Trigger notification
        await createNotification(
            req.user.id,
            'Trip',
            '🌍',
            'Trip Created!',
            `Your trip to ${destination} has been successfully planned.`
        );

        res.status(201).json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.findAll({
            where: { UserId: req.user.id },
            order: [['createdAt', 'DESC']],
        });
        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            where: { id: req.params.id, UserId: req.user.id },
        });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const { destination, startDate, endDate, status } = req.body;
        let trip = await Trip.findOne({
            where: { id: req.params.id, UserId: req.user.id },
        });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        trip = await trip.update({
            destination,
            startDate,
            endDate,
            status,
        });

        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            where: { id: req.params.id, UserId: req.user.id },
        });

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        await trip.destroy();
        res.json({ message: 'Trip removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
