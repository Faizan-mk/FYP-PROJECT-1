import HomePage from './app/frontend/Pages/Home Page/HomePage'
import Settings from "./app/frontend/Pages/Setting page/SettingPage";
import './App.css'
import AboutPage from './app/frontend/Pages/AboutUsContactPage/AboutPage'
import WeatherPage from './app/frontend/Pages/WEATHER PAGE/WeatherPage'
import PreviousTripPage from './app/frontend/Pages/prevoiustrip/PreviousTripPage'
import ContactPage from './app/frontend/Pages/AboutUsContactPage/ContactPage'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './app/frontend/Pages/Dashboard Page/DashboardPage'
import LoginPage from './app/frontend/Pages/Auth Page/LoginPage'
import SignupPage from './app/frontend/Pages/Auth Page/SignupPage'
import ForgotPasswordPage from './app/frontend/Pages/Auth Page/ForgotPasswordPage'
import ResetPasswordPage from './app/frontend/Pages/Auth Page/ResetPasswordPage'
import TravelerDestinationsPage from './app/frontend/Pages/TravelerDestinationsPage/TravelerDestinationsPage'
import TravelerDestinationDetailPage from './app/frontend/Pages/TravelerDestinationsPage/TravelerDestinationDetailPage'
import TravelPackagesPage from './app/frontend/Pages/TravelPackagesPage/TravelPackagesPage'
import TravelerFlightsPage from './app/frontend/Pages/TravelerFlightsPage/TravelerFlightsPage'
import FlightSearchPage from './app/frontend/Pages/FlightsPage/FlightSearchPage'
import TravelerHotelsPage from './app/frontend/Pages/TravelerHotelsPage/TravelerHotelsPage'
import TravelerHotelDetailPage from './app/frontend/Pages/TravelerHotelsPage/TravelerHotelDetailPage'

// ── NEW Pakistan Transport Module ──────────────────────────────────────
import TransportPage from './app/frontend/Pages/TransportPage/TransportPage'
import TransportSearchPage from './app/frontend/Pages/TransportPage/TransportSearchPage'
// ───────────────────────────────────────────────────────────────────────

import AdminFlightsPage from './app/frontend/Pages/AdminFlightsPage/AdminFlightsPage'
import AdminDestinationsPage from './app/frontend/Pages/AdminDestinationsPage/AdminDestinationsPage'
import AdminTransportPage from './app/frontend/Pages/AdminTransportPage/AdminTransportPage'
import AdminHotelsPage from './app/frontend/Pages/AdminHotelsPage/AdminHotelsPage'
import MyBookingsPage from './app/frontend/Pages/MyBookingsPage/MyBookingsPage'
import PlanMyTripPage from './app/frontend/Pages/PlanMyTripPage/PlanMyTripPage'
import ExplorePakistanPage from './app/frontend/Pages/ExplorePakistanPage/ExplorePakistanPage'
import CostEstimatorPage from './app/frontend/Pages/CostEstimatorPage/CostEstimatorPage'
import BudgetPlannerPage from './app/frontend/Pages/BudgetPlannerPage/BudgetPlannerPage'
import TripOverviewDashboard from './app/frontend/Pages/TRIP OVERVIEW DASHBOARD/TripOverviewDashboard'
import AIChatbotPage from './app/frontend/Pages/AI CHATBOT PAGE/AIChatbotPage'
import SafetyEmergencyPage from './app/frontend/Pages/SAFETY & EMERGENCY PAGE/SafetyEmergencyPage'
import NotificationsPage from './app/frontend/Pages/NOTIFICATIONS PAGE/NotificationsPage'
import CreateTripPage from './app/frontend/Pages/CreateTrip/CreateTrip'

function PrivateRoute({ children }) {
  const authed = typeof window !== 'undefined' && localStorage.getItem('authToken')
  return authed ? children : <Navigate to="/auth" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/destination" element={<PrivateRoute><TravelerDestinationsPage /></PrivateRoute>} />
        <Route path="/destination/:id" element={<PrivateRoute><TravelerDestinationDetailPage /></PrivateRoute>} />
        <Route path="/packages" element={<PrivateRoute><TravelPackagesPage /></PrivateRoute>} />
        <Route path="/flights" element={<PrivateRoute><TravelerFlightsPage /></PrivateRoute>} />
        <Route path="/flights/:airlineCode" element={<PrivateRoute><FlightSearchPage /></PrivateRoute>} />
        <Route path="/admin/flights" element={<PrivateRoute><AdminFlightsPage /></PrivateRoute>} />

        <Route path="/admin/destinations" element={<PrivateRoute><AdminDestinationsPage /></PrivateRoute>} />
        <Route path="/admin/hotels" element={<PrivateRoute><AdminHotelsPage /></PrivateRoute>} />
        <Route path="/traveler/destinations/:id" element={<PrivateRoute><TravelerDestinationDetailPage /></PrivateRoute>} />
        <Route path="/traveler/destinations" element={<PrivateRoute><TravelerDestinationsPage /></PrivateRoute>} />
        <Route path="/traveler/packages" element={<Navigate to="/packages" replace />} />
        <Route path="/traveler/flights" element={<PrivateRoute><TravelerFlightsPage /></PrivateRoute>} />
        <Route path="/hotels" element={<Navigate to="/traveler/hotels" replace />} />
        <Route path="/traveler/hotels/:id" element={<PrivateRoute><TravelerHotelDetailPage /></PrivateRoute>} />
        <Route path="/traveler/hotels" element={<PrivateRoute><TravelerHotelsPage /></PrivateRoute>} />

        {/* ── NEW Pakistan Transport Module ── */}
        <Route path="/transport" element={<PrivateRoute><TransportPage /></PrivateRoute>} />
        <Route path="/transport/:companyCode" element={<PrivateRoute><TransportSearchPage /></PrivateRoute>} />
        {/* Legacy redirect: keep old URLs working */}
        <Route path="/traveler/transport" element={<Navigate to="/transport" replace />} />
        {/* ─────────────────────────────────── */}

        <Route path="/admin/transport" element={<PrivateRoute><AdminTransportPage /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
        <Route path="/plan-my-trip" element={<PrivateRoute><PlanMyTripPage /></PrivateRoute>} />
        <Route path="/explore-pakistan" element={<PrivateRoute><ExplorePakistanPage /></PrivateRoute>} />
        <Route path="/trip-overview" element={<PrivateRoute><TripOverviewDashboard /></PrivateRoute>} />
        <Route path="/cost-estimator" element={<PrivateRoute><CostEstimatorPage /></PrivateRoute>} />
        <Route path="/budget-planner" element={<PrivateRoute><BudgetPlannerPage /></PrivateRoute>} />
        <Route path="/expense-tracker" element={<Navigate to="/my-bookings" replace />} />
        <Route path="/weather" element={<PrivateRoute><WeatherPage /></PrivateRoute>} />
        <Route path="/past-trips" element={<PrivateRoute><PreviousTripPage /></PrivateRoute>} />
        <Route path="/chatbot" element={<PrivateRoute><AIChatbotPage /></PrivateRoute>} />
        <Route path="/safety-emergency" element={<PrivateRoute><SafetyEmergencyPage /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/create-trip" element={<PrivateRoute><CreateTripPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
