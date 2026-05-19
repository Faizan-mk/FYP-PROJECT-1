import React from 'react';

const WeatherCard = ({ temp, condition, icon, humidity, wind, city, feelsLike }) => (
  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-6">
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        <h2 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Current Weather</h2>
        <h1 className="text-4xl font-black text-slate-900">{city}</h1>
        <p className="text-slate-500 font-medium mt-1">{new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center md:text-right">
          <p className="text-6xl font-black text-slate-900 leading-none">{temp}°</p>
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-2">{condition}</p>
        </div>
        <img src={icon} alt={condition} className="w-24 h-24" />
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-50">
      <div className="text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Humidity</p>
        <p className="text-lg font-black text-slate-900">{humidity}%</p>
      </div>
      <div className="text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Wind Speed</p>
        <p className="text-lg font-black text-slate-900">{wind} km/h</p>
      </div>
      <div className="text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Feels Like</p>
        <p className="text-lg font-black text-slate-900">{feelsLike}°</p>
      </div>
      <div className="text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Visibility</p>
        <p className="text-lg font-black text-slate-900">10 km</p>
      </div>
    </div>
  </div>
);

export default WeatherCard;
