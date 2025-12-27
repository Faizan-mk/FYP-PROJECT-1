import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherSearchBar from './Components/WeatherSearchBar';
import WeatherCard from './Components/WeatherCard';
import ForecastSlider from './Components/ForecastSlider';
import AISuggestion from './Components/AISuggestion';
import RefreshButton from './Components/RefreshButton';
import BackToDashboardButton from '../../components/BackToDashboardButton';

const mockWeather = {
  temp: 22,
  condition: 'Rain',
  icon: 'https://cdn.weatherapi.com/weather/64x64/day/296.png',
  humidity: 80,
  wind: 15,
};

const mockForecast = [
  { day: 'Mon', temp: 21, icon: 'https://cdn.weatherapi.com/weather/64x64/day/296.png', condition: 'Rain' },
  { day: 'Tue', temp: 23, icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png', condition: 'Sunny' },
  { day: 'Wed', temp: 19, icon: 'https://cdn.weatherapi.com/weather/64x64/day/122.png', condition: 'Cloudy' },
  { day: 'Thu', temp: 20, icon: 'https://cdn.weatherapi.com/weather/64x64/day/302.png', condition: 'Showers' },
  { day: 'Fri', temp: 22, icon: 'https://cdn.weatherapi.com/weather/64x64/day/176.png', condition: 'Partly cloudy' },
  { day: 'Sat', temp: 18, icon: 'https://cdn.weatherapi.com/weather/64x64/day/308.png', condition: 'Heavy rain' },
  { day: 'Sun', temp: 24, icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png', condition: 'Sunny' },
];

const WeatherPage = () => {
  const [weather, setWeather] = useState(mockWeather);
  const [forecast, setForecast] = useState(mockForecast);
  const [suggestion, setSuggestion] = useState('Rain expected — pack umbrella ☔');
  const navigate = useNavigate();

  const handleSearch = (city) => {
    // TODO: Fetch weather for city
    setSuggestion('Rain expected — pack umbrella ☔');
  };

  const handleRefresh = () => {
    // TODO: Refresh weather
    setSuggestion('Rain expected — pack umbrella ☔');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <BackToDashboardButton />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Weather Overview</span>
            </h1>
            <p className="mt-1 text-sm text-gray-600">Get up-to-date weather for your trip.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-sm p-5 shadow-md hover:shadow-lg transition-shadow">
              <WeatherSearchBar onSearch={handleSearch} />
              <WeatherCard {...weather} />
              <ForecastSlider forecast={forecast} />
              <AISuggestion suggestion={suggestion} />
              <RefreshButton onClick={handleRefresh} />
            </section>
          </div>
          <aside className="lg:col-span-1 space-y-4">
            {/* Placeholder for future weather-related widgets */}
            <div className="rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-sm p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-3">Weather Tools</h2>
              <p className="text-sm text-gray-500">More features coming soon!</p>
            </div>
          </aside>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-gray-200"
            onClick={() => navigate('/trip-overview')}
          >
            Back
          </button>
          <button
            className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-indigo-700"
            onClick={() => navigate('/expense-tracker')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
