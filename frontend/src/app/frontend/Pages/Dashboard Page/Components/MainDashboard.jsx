import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { tripService } from '../../../src/services/api';

function Stat({ title, value, accent }) {
  return (
    <div className="flex-1 min-w-[220px] p-4 rounded-xl bg-white ring-1 ring-gray-200 shadow transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-indigo-200">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</div>
        <span className={`inline-block w-2 h-2 rounded-full ${accent?.includes('indigo') ? 'bg-indigo-500' : accent?.includes('emerald') ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
      </div>
      <div className={`mt-2 text-2xl font-bold tracking-tight ${accent}`}>{value}</div>
    </div>
  )
}

export default function MainDashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAllTrips();
        setTrips(data || []);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const ongoingTrip = trips.find(t => t.status === 'ongoing') || trips[0];
  const pastTripsCount = trips.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Trips</h2>
        <button
          onClick={() => navigate('/create-trip')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Plan New Trip
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button onClick={() => navigate('/create-trip')} className="group relative overflow-hidden p-6 text-left rounded-xl bg-gray-900/0 ring-1 ring-gray-200 shadow transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-indigo-200">
          <div className="absolute inset-0">
            <img src="/pictures/img1.jpg" alt="Trip background" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent" />
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-white/90 text-indigo-700 grid place-items-center shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12M6 12h12" />
              </svg>
            </div>
            <div className="mt-4 text-lg font-semibold tracking-tight text-white">Create New Trip</div>
            <div className="text-sm text-white/80">Plan your next adventure</div>
            <div className="mt-4 inline-flex items-center text-white text-sm font-medium">
              Get started
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 transition group-hover:translate-x-0.5">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L9.586 11 7.293 8.707a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </button>

        <div className="p-6 rounded-xl bg-white ring-1 ring-gray-200 shadow transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-indigo-200">
          <div className="text-sm text-gray-500">Ongoing Trip</div>
          <div className="mt-2 text-lg font-semibold tracking-tight">
            {ongoingTrip ? ongoingTrip.destination : 'No Active Travel'}
          </div>
          <div className="mt-4">
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: ongoingTrip ? '33%' : '0%' }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {ongoingTrip ? 'Plan initiated' : 'Start a new trip'}
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => navigate('/trip-overview')} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100 transition active:scale-95">Continue</button>
              <button onClick={() => navigate('/trip-overview')} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 transition active:scale-95">Details</button>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white ring-1 ring-gray-200 shadow relative min-h-[200px] flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 text-white grid place-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 6.75h7.5m-9 0H6a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 006 18.75h12a2.25 2.25 0 002.25-2.25V9A2.25 2.25 0 0018 6.75h-.75m-9 0V6A2.25 2.25 0 1012 6v.75" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Past Trips</div>
                <div className="text-lg font-semibold tracking-tight">{pastTripsCount} trips</div>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-200">History</span>
          </div>

          <div className="mt-4 flex flex-1 items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            {pastTripsCount > 0 ? (
              <div className="text-gray-400 text-xs font-medium italic">Your travel history is recorded here</div>
            ) : (
              <div className="text-gray-400 text-xs font-medium italic">No past trips yet</div>
            )}
          </div>

          <button onClick={() => navigate('/past-trips')} className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm hover:bg-black transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h9.75A2.25 2.25 0 0019.5 18.75V12m-3.75-3L21 3m0 0h-4.5M21 3v4.5" />
            </svg>
            View History
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="text-base font-semibold tracking-tight">Analytics</div>
        <div className="flex flex-wrap gap-4">
          <Stat
            title="Trip Status"
            value={ongoingTrip ? (ongoingTrip.status === 'ongoing' ? 'Active' : 'Planned') : "No Active Trip"}
            accent="text-indigo-600"
          />
          <Stat
            title="Allocated Budget"
            value={ongoingTrip ? `PKR ${ongoingTrip.budget?.toLocaleString()}` : "PKR 0"}
            accent="text-emerald-600"
          />
          <Stat
            title="Departure Date"
            value={ongoingTrip ? new Date(ongoingTrip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
            accent="text-amber-600"
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/create-trip')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow transition hover:shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12M6 12h12" />
          </svg>
          Plan New Trip
        </button>
        <button
          onClick={() => navigate('/budget-planner')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50 transition hover:-translate-y-0.5 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5V9H3V7.5zM3 12h18v4.5A2.25 2.25 0 0118.75 18.75H5.25A2.25 2.25 0 013 16.5V12z" />
          </svg>
          Manage Budget
        </button>
      </div>
    </div>
  )
}
