const { Chat, Destination } = require('../model');
const { Op } = require('sequelize');
const axios = require('axios');

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:5001/api/chat';

/** Pull live destination hints from DB to enrich answers when AI service is down */
async function getLiveDestinationHint(message) {
    const words = String(message || '')
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3);
    if (!words.length) return '';

    const destinations = await Destination.findAll({
        where: {
            [Op.or]: words.map((w) => ({ name: { [Op.like]: `%${w}%` } })),
        },
        limit: 3,
    });

    if (!destinations.length) return '';

    const lines = destinations.map(
        (d) => `• ${d.name} (${d.type}) — typical weather: ${d.weather}`
    );
    return `\n\n📍 From your app destinations:\n${lines.join('\n')}`;
}

exports.sendMessage = async (req, res) => {
    try {
        const { message, context } = req.body;
        const trimmed = String(message || '').trim();
        let response = "Assalam o Alaikum! I'm your AI Travel Guide. Ask about hotels, flights, weather, budgets, or any destination in Pakistan and abroad.";
        let source = 'fallback';
        let confidence = 0;
        let itinerary = null;
        let itineraryMeta = null;

        try {
            const aiResponse = await axios.post(
                CHATBOT_API_URL,
                {
                    message: trimmed,
                    context: Array.isArray(context) ? context.slice(-6) : [],
                },
                {
                    timeout: 15000,
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (aiResponse.data?.message) {
                response = aiResponse.data.message;
                source = aiResponse.data.source || 'ai';
                confidence = aiResponse.data.confidence ?? 0;
                itinerary = aiResponse.data.itinerary || null;
                itineraryMeta = aiResponse.data.itineraryMeta || null;
            }
        } catch (aiError) {
            console.error('AI Chatbot API Error:', aiError.message);

            const lowerMsg = trimmed.toLowerCase();
            let liveHint = '';
            try {
                liveHint = await getLiveDestinationHint(trimmed);
            } catch (dbErr) {
                console.error('Destination hint error:', dbErr.message);
            }

            if (/hello|hi|hey|salam|assalam/i.test(lowerMsg)) {
                response =
                    "Hello! I'm your real-time travel guide with 20,000+ answers. Where would you like to go—Hunza, Lahore, Dubai, or Istanbul?";
            } else if (/hotel|stay|accommodation|resort/i.test(lowerMsg)) {
                response =
                    'For places to stay, open **Hotels** in the app. Tell me the city (e.g. "hotels in Hunza") for specific recommendations.';
            } else if (/flight|fly|airline|airport/i.test(lowerMsg)) {
                response =
                    'Search live routes in **Flights**—domestic PIA/Airblue/Serene and international carriers. Ask e.g. "flights to Dubai".';
            } else if (/weather|temperature|forecast|rain/i.test(lowerMsg)) {
                response =
                    'Check **Weather** in the dashboard for live forecasts. Northern areas: best Apr–Oct; book flexible flights to Skardu/Gilgit.';
            } else if (/budget|cost|price|expensive|cheap/i.test(lowerMsg)) {
                response =
                    'Use **Budget Planner** for a custom estimate. Typical ranges: domestic 3–5 days PKR 15k–50k; Dubai 4 days PKR 80k–150k.';
            } else if (/transport|bus|train|daewoo|uber|careem/i.test(lowerMsg)) {
                response =
                    'See **Transport** for buses, routes, and bookings. In cities use Careem/Uber; north requires 4x4 with experienced driver.';
            } else if (/safe|emergency|police/i.test(lowerMsg)) {
                response =
                    'Pakistan: Police 15, Rescue 1122, Ambulance 115. Open **Safety & Emergency** in the app for full contacts.';
            } else if (/food|eat|restaurant|biryani/i.test(lowerMsg)) {
                response =
                    'Ask me "what to eat in Lahore" or any city—I cover local dishes and famous spots across Pakistan and abroad.';
            } else if (/itinerary|day plan|schedule|day by day/i.test(lowerMsg)) {
                response =
                    'Tell me days + destination, e.g. **5 day itinerary Hunza** or **3 days in Lahore**. I will generate a full day-by-day plan.';
            } else {
                response =
                    "I'm your travel guide (20k+ topics). Try: 'Best hotels in Hunza', 'Dubai trip budget', 'weather in Skardu', or 'things to do in Istanbul'.";
            }
            response += liveHint;
            source = 'offline';
        }

        await Chat.create({
            userId: req.user.id,
            message: trimmed,
            response,
        });

        res.json({
            message: response,
            source,
            confidence,
            role: 'travel_guide',
            itinerary,
            itineraryMeta,
        });
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
