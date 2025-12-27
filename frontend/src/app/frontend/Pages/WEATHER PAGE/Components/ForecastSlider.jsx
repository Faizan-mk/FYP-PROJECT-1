import React from 'react';

const ForecastSlider = ({ forecast }) => (
  <div className="w-full overflow-x-auto py-2">
    <div className="flex gap-4 min-w-max">
      {forecast.map((day, idx) => (
        <div key={idx} className="bg-blue-50 rounded-lg shadow px-4 py-2 flex flex-col items-center min-w-[90px]">
          <span className="text-sm font-semibold">{day.day}</span>
          <img src={day.icon} alt={day.condition} className="h-8 w-8 my-1" />
          <span className="text-lg">{day.temp}&deg;C</span>
        </div>
      ))}
    </div>
  </div>
);

export default ForecastSlider;
