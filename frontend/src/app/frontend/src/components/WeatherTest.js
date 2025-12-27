import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherTest = () => {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/weather/current/${city}`);
      setWeather(response.data);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', maxWidth: '500px' }}>
      <h2>Weather Test</h2>
      <div>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      
      {weather && (
        <div style={{ marginTop: '20px' }}>
          <h3>Weather in {weather.city}</h3>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Conditions: {weather.description}</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind: {weather.windSpeed} km/h</p>
          {weather.icon && <img src={weather.icon} alt="Weather icon" />}
          {weather.mock && <p style={{ color: 'orange' }}>Note: Using mock data</p>}
        </div>
      )}
    </div>
  );
};

export default WeatherTest;
