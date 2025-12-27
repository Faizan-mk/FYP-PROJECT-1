import { useMemo, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import TripSummaryCard from './Components/TripSummaryCard'
import ItineraryTimeline from './Components/ItineraryTimeline'
import DestinationsMap from './Components/DestinationsMap'
import ActionButtons from './Components/ActionButtons'
import BackToDashboardButton from '../../components/BackToDashboardButton'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(amount).replace('PKR', 'PKR ');
};

export default function TripOverviewDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [summary, setSummary] = useState({
    destination: 'Not specified',
    dates: 'Not specified',
    cost: 'PKR 0',
    mode: 'Not specified',
    travelers: 1,
    budget: 'PKR 0',
    budgetBreakdown: []
  })

  useEffect(() => {
    // Get data from location state (passed from previous page)
    const locationData = location.state?.budgetData || {}
    
    // Get trip data from local storage
    const savedTrip = JSON.parse(localStorage.getItem('tripData')) || {}
    const savedBudget = JSON.parse(localStorage.getItem('travelBudgetPlannerData')) || {}
    const savedDestinations = JSON.parse(localStorage.getItem('selectedDestinations') || '[]')
    const savedTransport = JSON.parse(localStorage.getItem('bookedTransportOption') || '{}')
    
    // Get the first selected destination or use the saved trip data
    const selectedDestination = savedDestinations.length > 0 ? savedDestinations[0] : {}
    
    // Format dates if available (prefer saved trip data, then selected destination, then default)
    let datesText = 'Not specified'
    if (savedTrip.startDate && savedTrip.endDate) {
      const start = new Date(savedTrip.startDate).toLocaleDateString('en-PK')
      const end = new Date(savedTrip.endDate).toLocaleDateString('en-PK')
      datesText = `${start} - ${end}`
    } else if (selectedDestination.startDate && selectedDestination.endDate) {
      const start = new Date(selectedDestination.startDate).toLocaleDateString('en-PK')
      const end = new Date(selectedDestination.endDate).toLocaleDateString('en-PK')
      datesText = `${start} - ${end}`
    }
    
    // Get travel mode (prefer saved transport, then default to trip type)
    let travelMode = savedTrip.tripType || 'Not specified'
    if (savedTransport?.mode) {
      travelMode = `${savedTransport.mode.icon} ${savedTransport.mode.label}`
    }
    
    // Format cost
    let costText = 'PKR 0'
    if (savedBudget.totalBudget) {
      costText = formatCurrency(savedBudget.totalBudget)
    }
    // Set the destination from selectedDestination
    const destination = selectedDestination.name || 'Not specified'
    
    // Set the summary state
    setSummary({
      destination: savedTrip.destination || selectedDestination.name || 'Not specified',
      dates: datesText,
      cost: formatCurrency(locationData?.totalBudget || savedBudget.totalBudget || 0),
      mode: travelMode,
      travelers: savedTrip.travelers || 1,
      budget: savedTrip.budget ? `PKR ${savedTrip.budget.toLocaleString()}` : 'PKR 0',
      budgetBreakdown: locationData.breakdown || []
    })
  }, [location.state])

  const itinerary = [
    { day: 'Day 1', items: ['Arrival', 'Hotel Check-in'] },
    { day: 'Day 2', items: ['Sightseeing'] },
    { day: 'Day 3', items: ['Return'] },
  ]

  const destinations = [
    { name: 'Ngurah Rai International Airport', lat: -8.7482, lng: 115.1675 },
    { name: 'Kuta Beach', lat: -8.7179, lng: 115.1682 },
    { name: 'Ubud', lat: -8.5069, lng: 115.2625 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <BackToDashboardButton />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Trip Overview</span>
            </h1>
            <p className="mt-1 text-sm text-gray-600">Complete summary of your planned trip.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TripSummaryCard data={summary} />
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Itinerary</h2>
              <ItineraryTimeline days={itinerary} />
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-4">
            <DestinationsMap points={destinations} />
            <ActionButtons />
          </aside>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            className="w-full inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-gray-200"
            onClick={() => navigate('/budget-planner')}
          >
            Back
          </button>
          <button
            className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-black font-semibold shadow-sm hover:shadow-md hover:bg-indigo-700"
            onClick={() => navigate('/weather')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
