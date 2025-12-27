import { useState } from 'react'
import TopBar from './Components/TopBar'
import Sidebar from './Components/Sidebar'
import MainDashboard from './Components/MainDashboard'

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopBar onOpenSidebar={() => setMobileOpen(true)} />
      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-4 left-0 h-[50vh] w-[50vw] sm:w-56 bg-white shadow-xl ring-1 ring-gray-200 p-2 rounded-r-2xl overflow-y-auto transform transition-transform duration-300 ease-out -translate-x-full data-[open=true]:translate-x-0 pt-2" data-open="true">
            <button onClick={() => setMobileOpen(false)} className="absolute top-2 right-2 p-2 rounded-lg hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-600">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="pr-1 pb-2 max-h-full overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </div>
      )}
      <div className="flex">
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <MainDashboard />
          </div>
        </main>
      </div>
    </div>
  )
}
