import React from 'react';

const WeatherCard = ({ temp, condition, icon, humidity, wind }) => (
  <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center gap-2 w-full max-w-xs mx-auto my-4">
    <div className="flex items-center gap-2">
      <img src={icon} alt={condition} className="h-10 w-10" />
      <span className="text-3xl font-bold">{temp}&deg;C</span>
    </div>
    <div className="text-lg font-medium text-gray-700">{condition}</div>
    <div className="flex gap-4 text-gray-500 text-sm">
      <span>💧 {humidity}%</span>
      <span>💨 {wind} km/h</span>
    </div>
  </div>
);

export default WeatherCard;
