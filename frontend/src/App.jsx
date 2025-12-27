import HomePage from './app/frontend/Pages/Home Page/HomePage'
import Settings from "./app/frontend/Pages/Setting page/SettingPage";
import ProfilePage from "./app/frontend/Pages/Profile Page/ProfilePage";
import './App.css'
import AboutPage from './app/frontend/Pages/AboutUsContactPage/AboutPage'
import WeatherPage from './app/frontend/Pages/WEATHER PAGE/WeatherPage'
import PreviousTripPage from './app/frontend/Pages/prevoiustrip/PreviousTripPage'
import ContactPage from './app/frontend/Pages/AboutUsContactPage/ContactPage'
import WhatsApp from './app/frontend/components/WhatsApp/WhatsApp'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './app/frontend/Pages/Dashboard Page/DashboardPage'
import LoginPage from './app/frontend/Pages/Auth Page/LoginPage'
import SignupPage from './app/frontend/Pages/Auth Page/SignupPage'
import TravelerDestinationsPage from './app/frontend/Pages/Traveler Destinations Page/TravelerDestinationsPage'
import TravelerFlightsPage from './app/frontend/Pages/Traveler Flights Page/TravelerFlightsPage'
import TravelerHotelsPage from './app/frontend/Pages/Traveler Hotels Page/TravelerHotelsPage'
import TravelerAirlinesPage from './app/frontend/Pages/Traveler Airlines Page/TravelerAirlinesPage'
import TravelerTransportPage from './app/frontend/Pages/Traveler Transport Page/TravelerTransportPage'
import AdminFlightsPage from './app/frontend/Pages/Admin Flights Page/AdminFlightsPage'
import AdminHotelsPage from './app/frontend/Pages/Admin Hotels Page/AdminHotelsPage'
import AdminAirlinesPage from './app/frontend/Pages/Admin Airlines Page/AdminAirlinesPage'
import AdminDestinationsPage from './app/frontend/Pages/Admin Destinations Page/AdminDestinationsPage'
import AdminTransportPage from './app/frontend/Pages/Admin Transport Page/AdminTransportPage'
import CostEstimatorPage from './app/frontend/Pages/COST ESTIMATOR PAGE/CostEstimatorPage'
import BudgetPlannerPage from './app/frontend/Pages/BUDGET PLANNER PAGE/BudgetPlannerPage'
import TripOverviewDashboard from './app/frontend/Pages/TRIP OVERVIEW DASHBOARD/TripOverviewDashboard'
import ExpenseTrackerPage from './app/frontend/Pages/EXPENSE TRACKER PAGE/ExpenseTrackerPage'
import AIChatbotPage from './app/frontend/Pages/AI CHATBOT PAGE/AIChatbotPage'
import SafetyEmergencyPage from './app/frontend/Pages/SAFETY & EMERGENCY PAGE/SafetyEmergencyPage'
import NotificationsPage from './app/frontend/Pages/NOTIFICATIONS PAGE/NotificationsPage'
import CreateTripPage from './app/frontend/Pages/Create Trip/CreateTrip'

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
        <Route path="/flights" element={<PrivateRoute><TravelerFlightsPage /></PrivateRoute>} />
        <Route path="/admin/flights" element={<PrivateRoute><AdminFlightsPage /></PrivateRoute>} />
        <Route path="/admin/hotels" element={<PrivateRoute><AdminHotelsPage /></PrivateRoute>} />
        <Route path="/admin/airlines" element={<PrivateRoute><AdminAirlinesPage /></PrivateRoute>} />
        <Route path="/admin/destinations" element={<PrivateRoute><AdminDestinationsPage /></PrivateRoute>} />
        <Route path="/traveler/destinations" element={<PrivateRoute><TravelerDestinationsPage /></PrivateRoute>} />
        <Route path="/traveler/flights" element={<PrivateRoute><TravelerFlightsPage /></PrivateRoute>} />
        <Route path="/traveler/hotels" element={<PrivateRoute><TravelerHotelsPage /></PrivateRoute>} />
        <Route path="/traveler/airlines" element={<PrivateRoute><TravelerAirlinesPage /></PrivateRoute>} />
        <Route path="/admin/transport" element={<PrivateRoute><AdminTransportPage /></PrivateRoute>} />
        <Route path="/traveler/transport" element={<PrivateRoute><TravelerTransportPage /></PrivateRoute>} />
        <Route path="/cost-estimator" element={<PrivateRoute><CostEstimatorPage /></PrivateRoute>} />
        <Route path="/budget-planner" element={<PrivateRoute><BudgetPlannerPage /></PrivateRoute>} />
        <Route path="/trip-overview" element={<PrivateRoute><TripOverviewDashboard /></PrivateRoute>} />
        <Route path="/expense-tracker" element={<PrivateRoute><ExpenseTrackerPage /></PrivateRoute>} />
        <Route path="/weather" element={<PrivateRoute><WeatherPage /></PrivateRoute>} />
        <Route path="/past-trips" element={<PrivateRoute><PreviousTripPage /></PrivateRoute>} />
        <Route path="/chatbot" element={<PrivateRoute><AIChatbotPage /></PrivateRoute>} />
        <Route path="/safety-emergency" element={<PrivateRoute><SafetyEmergencyPage /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><AboutPage /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
        <Route path="/create-trip" element={<PrivateRoute><CreateTripPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WhatsApp />
    </BrowserRouter>
  )
}

export default App
