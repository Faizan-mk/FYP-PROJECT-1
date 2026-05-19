import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()
  const role = (localStorage.getItem('userRole') || 'traveler').toLowerCase();

  const pathForKey = (key) => {
    if (key === 'Destinations' || key === 'Manage Destinations') return role === 'admin' ? '/admin/destinations' : '/destination'
    if (key === 'Tour packages') return '/packages'
    if (key === 'Dashboard') return '/dashboard'
    if (key === 'Flights' || key === 'Manage Flights') return role === 'admin' ? '/admin/flights' : '/traveler/flights'
    if (key === 'Hotels' || key === 'Manage Hotels') return role === 'admin' ? '/admin/hotels' : '/traveler/hotels'
    if (key === 'Transport' || key === 'Manage Transport') return role === 'admin' ? '/admin/transport' : '/transport'
    if (key === 'My Bookings') return '/my-bookings'
    if (key === 'Cost Estimator') return '/cost-estimator'
    if (key === 'Budget Planner') return '/budget-planner'
    if (key === 'Plan My Trip') return '/plan-my-trip'
    if (key === 'Explore Pakistan') return '/explore-pakistan'
    if (key === 'Trip Overview Dashboard') return '/trip-overview'
    if (key === 'Weather') return '/weather'
    if (key === 'Chatbot') return '/chatbot'
    if (key === 'Safety') return '/safety-emergency'
    if (key === 'Notifications') return '/notifications'
    if (key === 'Settings') return '/settings'
    return null
  }

  const items = [
    { key: 'Dashboard', icon: '🏠' },
    { key: role === 'admin' ? 'Manage Destinations' : 'Destinations', icon: '🗺️', badge: 'New' },
    { key: 'Tour packages', icon: '🧳' },
    // Dynamic items based on role
    { key: role === 'admin' ? 'Manage Flights' : 'Flights', icon: '✈️' },
    { key: role === 'admin' ? 'Manage Hotels' : 'Hotels', icon: '🏨' },
    { key: role === 'admin' ? 'Manage Transport' : 'Transport', icon: '🚗' },

    { key: 'My Bookings', icon: '📑' },
    { key: 'Cost Estimator', icon: '💰' },
    { key: 'Budget Planner', icon: '📊' },
    { key: 'Plan My Trip', icon: '🧭' },
    { key: 'Explore Pakistan', icon: '🏔️' },
    { key: 'Trip Overview Dashboard', icon: '📋' },
    { key: 'Weather', icon: '☁️' },
    { key: 'Chatbot', icon: '🤖', badge: 'Beta' },
    { key: 'Safety', icon: '🛡️' },
    { key: 'Notifications', icon: '🔔' },
    { key: 'Settings', icon: '⚙️' },
  ]

  const handleClick = (item) => {
    const path = pathForKey(item.key)
    if (path) {
      navigate(path)
      onNavigate?.()
    }
  }
  return (
    <nav className="p-3 select-none h-[calc(100vh-64px)] overflow-y-auto thin-scrollbar">
      <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Menu</div>
      <ul className="space-y-1.5 rounded-2xl p-2 bg-white/70 backdrop-blur-md ring-1 ring-gray-200 shadow-md">
        {items.map((item) => {
          const itemPath = pathForKey(item.key)
          const isActive = itemPath && location.pathname === itemPath
          return (
          <li key={item.key}>
            <button
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleClick(item)}
              className={`group relative w-full flex items-start gap-3 pl-4 pr-3 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${isActive
                ? 'bg-white text-indigo-700 shadow ring-1 ring-indigo-200'
                : 'text-gray-700 hover:bg-white hover:shadow hover:ring-1 hover:ring-gray-200 hover:translate-x-[2px]'
                }`}
            >
              <span className={`absolute left-1 top-2 bottom-2 w-1 rounded-full transition-opacity ${isActive
                ? 'bg-gradient-to-b from-indigo-500 to-purple-600 opacity-100'
                : 'bg-gradient-to-b from-indigo-200/40 to-purple-200/40 opacity-0 group-hover:opacity-100'
                }`} />

              <span className={`relative z-10 inline-grid place-items-center w-8 h-8 rounded-lg text-sm flex-none ${isActive
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 group-hover:from-indigo-100 group-hover:to-indigo-200'
                }`}>
                {item.icon}
              </span>
              <span className="relative z-10 flex-1 text-left leading-snug whitespace-normal break-words group-hover:translate-x-0.5 transition-transform font-medium">
                {item.key}
              </span>
              {item.badge && (
                <span className="relative z-10 ml-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-semibold ring-1 ring-indigo-200 shrink-0">
                  {item.badge}
                </span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="relative z-10 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0 self-center">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L9.586 11 7.293 8.707a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        )})}
      </ul>
    </nav>
  )
}
