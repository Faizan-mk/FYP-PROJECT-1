const Estimation = require('../model/Estimation');

exports.saveEstimation = async (req, res) => {
    try {
        const {
            destination,
            duration,
            travelers,
            transportType,
            accommodationType,
            dailyAllowance,
            totalEstimate,
            breakdown
        } = req.body;

        const estimation = await Estimation.create({
            destination,
            duration,
            travelers,
            transportType,
            accommodationType,
            dailyAllowance,
            totalEstimate,
            breakdown,
            UserId: req.user.id
        });

        res.status(201).json(estimation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getEstimations = async (req, res) => {
    try {
        const estimations = await Estimation.findAll({
            where: { UserId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(estimations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteEstimation = async (req, res) => {
    try {
        const estimation = await Estimation.findOne({
            where: { id: req.params.id, UserId: req.user.id }
        });

        if (!estimation) {
            return res.status(404).json({ message: 'Estimation not found' });
        }

        await estimation.destroy();
        res.json({ message: 'Estimation removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
