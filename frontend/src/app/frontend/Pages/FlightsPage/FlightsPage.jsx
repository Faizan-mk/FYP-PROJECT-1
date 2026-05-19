import { useLocation } from 'react-router-dom'
import BackToDashboardButton from '../../components/BackToDashboardButton'

export default function FlightsPage() {
  const location = useLocation()
  const selected = location.state?.destinations || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <BackToDashboardButton />
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Flights</h1>
            <p className="text-gray-700">This is a placeholder. You'll integrate flight selection here.</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Selected destinations</h2>
          {selected.length === 0 ? (
            <div className="text-sm text-gray-500">No destinations passed from previous step.</div>
          ) : (
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              {selected.map((d) => (
                <li key={d.id}>{d.name} ({d.type})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
