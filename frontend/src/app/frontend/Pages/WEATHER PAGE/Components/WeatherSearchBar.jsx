import React, { useState } from 'react';

const WeatherSearchBar = ({ onSearch }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city (e.g. Islamabad, Karachi)..."
            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
        </div>
        <button
          type="submit"
          className="bg-slate-900 text-black px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg whitespace-nowrap"
        >
          Check Weather
        </button>
      </form>
      <div className="flex flex-wrap gap-2 mt-4">
        {['Islamabad', 'Karachi', 'Lahore', 'Hunza'].map(c => (
          <button
            key={c}
            onClick={() => onSearch(c)}
            className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeatherSearchBar;
