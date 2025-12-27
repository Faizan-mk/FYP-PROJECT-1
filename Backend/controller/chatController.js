const { Chat } = require('../model');

exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        let response = "I'm your travel assistant. Currently I'm in beta, but you can ask about destinations, trips, and more!";

        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            response = "Hello! How can I help you plan your perfect trip today?";
        } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
            response = "I can help you estimate costs. Which destination are you considering?";
        } else if (lowerMsg.includes('hotel')) {
            response = "Looking for a place to stay? I can suggest hotels based on your budget.";
        } else if (lowerMsg.includes('weather')) {
            response = "Weather is important! Most destinations in the north are currently cool, while the south is warm.";
        } else if (lowerMsg.includes('pakistan')) {
            response = "Pakistan is a beautiful country! You should check out Hunza, Skardu, and Lahore.";
        }

        const chat = await Chat.create({
            userId: req.user.id,
            message,
            response
        });

        res.json({ message: response });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getChatHistory = async (req, res) => {
    try {
        const history = await Chat.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'ASC']]
        });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
