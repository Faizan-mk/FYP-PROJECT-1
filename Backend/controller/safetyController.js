const { Safety } = require('../model');

const DEFAULT_DESTINATION = 'Pakistan';

const resolveSafetyRecord = async (destination) => {
    if (destination) {
        const match = await Safety.findOne({ where: { destination } });
        if (match) return match;
    }

    const pakistan = await Safety.findOne({ where: { destination: DEFAULT_DESTINATION } });
    if (pakistan) return pakistan;

    return Safety.findOne({ where: { destination: 'Global' } });
};

exports.getSafetyData = async (req, res) => {
    try {
        const { destination } = req.query;
        const safetyData = await resolveSafetyRecord(destination);

        res.status(200).json({
            success: true,
            data: safetyData
        });
    } catch (error) {
        console.error('Fetch Safety Data Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addSafetyData = async (req, res) => {
    try {
        const data = await Safety.create(req.body);
        res.status(201).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Add Safety Data Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
