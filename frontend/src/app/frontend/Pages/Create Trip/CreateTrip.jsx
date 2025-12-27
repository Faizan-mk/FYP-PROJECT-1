import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackToDashboardButton from '../../components/BackToDashboardButton';
import { tripService } from '../../src/services/api';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    days: 0,
    budget: '',
    travelers: 1,
    tripType: 'vacation',
  });

  const calculateTripDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate - startDate;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedTripData = {
      ...tripData,
      [name]: name === 'travelers' ? parseInt(value, 10) : value
    };

    // Recalculate days if start or end date changes
    if (name === 'startDate' || name === 'endDate') {
      updatedTripData.days = calculateTripDays(
        name === 'startDate' ? value : tripData.startDate,
        name === 'endDate' ? value : tripData.endDate
      );
    }

    setTripData(updatedTripData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the trip data in the required format
    const tripDataToSave = {
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      budget: parseInt(tripData.budget, 10) || 0,
      travelers: tripData.travelers,
      tripType: tripData.tripType
    };

    try {
      // Save to Backend
      await tripService.createTrip(tripDataToSave);

      // Also keep in localStorage for immediate wizard flow if needed
      localStorage.setItem('tripData', JSON.stringify(tripDataToSave));

      console.log('Trip data saved to backend:', tripDataToSave);

      // Redirect to destination selection as the next step in the wizard
      navigate('/destination');
    } catch (error) {
      console.error('Failed to save trip:', error.message);
      alert('Failed to save trip: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="mb-4 flex justify-start">
          <BackToDashboardButton />
        </div>
        <div className="mb-6 sm:mb-8 text-center text-gray-900">
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs sm:text-sm font-medium backdrop-blur border border-white/20">
            ✈️ Smart Travel Planner
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
            Plan Your Next Adventure
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Set your destination, dates and budget. We will help you organize the perfect trip experience.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm shadow-2xl shadow-indigo-900/20 border border-indigo-100 rounded-2xl p-5 sm:p-8 transform transition-all duration-300 hover:shadow-indigo-900/30">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  Where are you going?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    required
                    value={tripData.destination}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm placeholder-gray-400 transition-shadow focus:shadow-md"
                    placeholder="e.g. Hunza Valley, Istanbul, Dubai"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tripType" className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <select
                    id="tripType"
                    name="tripType"
                    value={tripData.tripType}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-shadow focus:shadow-md cursor-pointer"
                  >
                    <option value="vacation">Vacation</option>
                    <option value="business">Business</option>
                    <option value="backpacking">Backpacking</option>
                    <option value="family">Family</option>
                    <option value="honeymoon">Honeymoon</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={tripData.startDate}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-shadow focus:shadow-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    value={tripData.endDate}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-shadow focus:shadow-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Duration (days)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="days"
                    name="days"
                    min="1"
                    value={tripData.days || ''}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-shadow focus:shadow-md"
                    placeholder="Enter number of days"
                  />
                </div>
                {tripData.startDate && tripData.endDate && (
                  <p className="mt-1 text-xs text-gray-500">
                    {`${calculateTripDays(tripData.startDate, tripData.endDate)} days based on selected dates`}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (PKR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₨</span>
                  </div>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={tripData.budget}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-shadow focus:shadow-md"
                    placeholder="50,000"
                  />
                </div>
              </div>

              <div>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-sm font-medium text-blue-800">
                    Trip Duration: <span className="font-bold">{tripData.days} {tripData.days === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>

                <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Travelers
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    id="travelers"
                    name="travelers"
                    min="1"
                    value={tripData.travelers}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-shadow focus:shadow-md"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium mr-2 text-[11px] sm:text-xs">
                  Tip
                </span>
                You can always edit trip details later from your dashboard.
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:-translate-y-0.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 border border-transparent text-sm font-semibold rounded-xl text-gray-700 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Create Trip
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
