const getWeatherData = async (req, res) => {
    try {
        const { city } = req.params;

        // Cities data map for more realistic mock response
        const cityData = {
            'karachi': { temp: 30, condition: 'Sunny', humidity: 65, wind: 15, feelsLike: 34 },
            'lahore': { temp: 28, condition: 'Hazy', humidity: 50, wind: 8, feelsLike: 30 },
            'islamabad': { temp: 24, condition: 'Clear', humidity: 45, wind: 10, feelsLike: 25 },
            'hunza': { temp: 15, condition: 'Cold', humidity: 30, wind: 5, feelsLike: 14 },
            'skardu': { temp: 12, condition: 'Cloudy', humidity: 40, wind: 12, feelsLike: 10 },
            'murree': { temp: 18, condition: 'Rain', humidity: 80, wind: 20, feelsLike: 17 },
            'multan': { temp: 35, condition: 'Sunny', humidity: 20, wind: 15, feelsLike: 38 },
            'peshawar': { temp: 27, condition: 'Clear', humidity: 40, wind: 10, feelsLike: 28 },
            'gwadar': { temp: 29, condition: 'Clear', humidity: 70, wind: 25, feelsLike: 32 },
            'fairy meadows': { temp: 10, condition: 'Partly Cloudy', humidity: 35, wind: 18, feelsLike: 8 }
        };

        const normalizedCity = city.toLowerCase();
        const data = cityData[normalizedCity] || {
            temp: 22 + Math.floor(Math.random() * 10),
            condition: ['Sunny', 'Cloudy', 'Rain', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
            humidity: 40 + Math.floor(Math.random() * 40),
            wind: 5 + Math.floor(Math.random() * 20),
            feelsLike: 23 + Math.floor(Math.random() * 8)
        };

        // Generate Forecast
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const conditions = [
            { cond: 'Sunny', icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png' },
            { cond: 'Cloudy', icon: 'https://cdn.weatherapi.com/weather/64x64/day/122.png' },
            { cond: 'Rain', icon: 'https://cdn.weatherapi.com/weather/64x64/day/302.png' },
            { cond: 'Partly Cloudy', icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png' }
        ];

        const forecast = days.map(day => {
            const randomCond = conditions[Math.floor(Math.random() * conditions.length)];
            return {
                day,
                temp: data.temp + (Math.floor(Math.random() * 6) - 3),
                condition: randomCond.cond,
                icon: randomCond.icon
            };
        });

        const iconMap = {
            'Sunny': 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
            'Clear': 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
            'Cloudy': 'https://cdn.weatherapi.com/weather/64x64/day/122.png',
            'Rain': 'https://cdn.weatherapi.com/weather/64x64/day/302.png',
            'Partly Cloudy': 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
            'Hazy': 'https://cdn.weatherapi.com/weather/64x64/day/143.png',
            'Cold': 'https://cdn.weatherapi.com/weather/64x64/day/122.png'
        };

        res.status(200).json({
            city: city.charAt(0).toUpperCase() + city.slice(1),
            temp: data.temp,
            condition: data.condition,
            icon: iconMap[data.condition] || iconMap['Sunny'],
            humidity: data.humidity,
            wind: data.wind,
            feelsLike: data.feelsLike,
            forecast,
            suggestion: data.condition === 'Rain' ? 'Expect rain—don\'t forget your umbrella! ☔' :
                data.temp > 30 ? 'It\'s hot outside—stay hydrated! 💧' :
                    data.temp < 15 ? 'Chilly weather—pack a warm jacket! 🧥' :
                        'Perfect weather for exploring! ✈️'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weather data', error: error.message });
    }
};

module.exports = { getWeatherData };
