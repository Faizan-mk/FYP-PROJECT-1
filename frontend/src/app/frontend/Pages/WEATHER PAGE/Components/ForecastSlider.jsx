import React from 'react';

const ForecastSlider = ({ forecast }) => (
  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-6">
    <h3 className="text-xl font-black text-slate-900 mb-6">7-Day Forecast</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
      {forecast.map((day, index) => (
        <div key={index} className="flex flex-col items-center bg-slate-50 rounded-2xl p-4 border border-slate-100 transition-colors hover:bg-white hover:border-indigo-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{day.day}</p>
          <img src={day.icon} alt={day.condition} className="w-10 h-10 mb-2" />
          <p className="text-lg font-black text-slate-900 leading-none">{day.temp}°</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 text-center truncate w-full">{day.condition}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ForecastSlider;
