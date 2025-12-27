import React from "react";
import { useNavigate } from "react-router-dom";
import BackToDashboardButton from '../../components/BackToDashboardButton';

const trips = [
  {
    id: 1,
    destination: "Hunza Valley, Pakistan",
    date: "2024-06-18",
    description: "Road trip to Hunza with views of Rakaposhi and Attabad Lake.",
    image: "/pictures/hotal 1.jpg"
  },
  {
    id: 2,
    destination: "Murree & Patriata, Pakistan",
    date: "2023-12-05",
    description: "Weekend getaway with chairlift rides and pine forest walks.",
    image: "/pictures/hotal 1.png"
  },
  {
    id: 3,
    destination: "Lahore, Pakistan",
    date: "2023-03-22",
    description: "Visited Badshahi Mosque, Lahore Fort and tried famous street food.",
    image: "/pictures/hota 3.jpg"
  }
];

const PreviousTripPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-50 py-12 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <BackToDashboardButton />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg text-2xl">
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-7 h-7'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </span>
            <div>
              <h2 className="text-3xl font-bold text-indigo-700 tracking-tight">Previous Trips</h2>
              <p className="text-sm text-gray-500">Review your completed adventures and memories.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {trips.map(trip => (
            <div
              key={trip.id}
              className="group bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl hover:ring-indigo-200"
            >
              <div className="relative">
                <img src={trip.image} alt={trip.destination} className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute top-3 right-3 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full px-3 py-1 text-xs font-semibold shadow-lg">{trip.date}</span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 mr-1"></span>
                  {trip.destination}
                </h3>
                <p className="text-gray-600 flex-1 mb-3">{trip.description}</p>
                <div className="mt-auto flex items-center gap-2">
                  <span className="inline-block w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 ring-2 ring-indigo-100">
                    <img src={trip.image} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  </span>
                  <span className="text-xs text-gray-400">Trip #{trip.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviousTripPage;
