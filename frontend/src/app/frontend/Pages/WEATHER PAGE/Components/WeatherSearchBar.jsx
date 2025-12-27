import React, { useState } from 'react';

const WeatherSearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');
  return (
    <div className="flex items-center gap-2 w-full max-w-md mx-auto my-4">
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter City"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg font-semibold"
        onClick={() => onSearch(city)}
      >
        Search
      </button>
    </div>
  );
};

export default WeatherSearchBar;
