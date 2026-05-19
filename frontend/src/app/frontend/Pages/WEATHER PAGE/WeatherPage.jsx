import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherSearchBar from './Components/WeatherSearchBar';
import WeatherCard from './Components/WeatherCard';
import ForecastSlider from './Components/ForecastSlider';
import AISuggestion from './Components/AISuggestion';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import api from '../../src/config/api';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState('');
  const navigate = useNavigate();

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/weather/${city}`);
      setWeatherData(response.data);
      setCurrentCity(city);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('City not found. Please try a major city name.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedDestinations = JSON.parse(localStorage.getItem('selectedDestinations') || '[]');
    const defaultCity = savedDestinations[0]?.name || 'Islamabad';
    fetchWeather(defaultCity);
  }, []);

  // Auto-refresh weather data every 10 seconds
  useEffect(() => {
    if (!currentCity) return;

    const intervalId = setInterval(() => {
      console.log('Auto-refreshing weather data...');
      // Fetch without showing loading state for smoother UX
      api.get(`/weather/${currentCity}`)
        .then(response => {
          setWeatherData(response.data);
          setError(null);
        })
        .catch(err => {
          console.error('Error auto-refreshing weather:', err);
        });
    }, 10000); // 10 seconds

    // Cleanup interval on unmount or when city changes
    return () => clearInterval(intervalId);
  }, [currentCity]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Simple Header */}
        <div className="mb-10">
          <BackToDashboardButton />
          <h1 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">Weather Forecast</h1>
          <p className="text-slate-500 font-medium">Plan your travel according to the current weather conditions.</p>
        </div>

        {/* Search */}
        <WeatherSearchBar onSearch={fetchWeather} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Fetching latest weather...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="text-xl font-black text-slate-900 mb-2">Something went wrong</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <button
              onClick={() => fetchWeather('Islamabad')}
              className="px-6 py-2 bg-slate-900 text-black rounded-xl font-bold hover:bg-indigo-600 transition-all"
            >
              Try Islamabad
            </button>
          </div>
        ) : weatherData && (
          <div className="animate-in fade-in duration-500">
            {/* Main Weather */}
            <WeatherCard
              city={weatherData.city}
              temp={weatherData.temp}
              condition={weatherData.condition}
              icon={weatherData.icon}
              humidity={weatherData.humidity}
              wind={weatherData.wind}
              feelsLike={weatherData.feelsLike}
            />

            {/* AI Insight */}
            <AISuggestion suggestion={weatherData.suggestion} />

            {/* Weekly Forecast */}
            <ForecastSlider forecast={weatherData.forecast} />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 border-t border-slate-200 pt-10">
          <button
            className="flex-1 bg-white border-2 border-slate-200 text-black px-8 py-4 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
            onClick={() => navigate('/trip-overview')}
          >
            <span>←</span> Back to Overview
          </button>
          <button
            className="flex-1 bg-white border-2 border-slate-900 text-black px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
            onClick={() => navigate('/explore-pakistan')}
          >
            Explore Pakistan <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
