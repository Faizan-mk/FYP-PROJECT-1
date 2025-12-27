import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Components
import WeatherTest from './components/WeatherTest';

// Import Pages
import HomePage from '../Pages/Home Page/HomePage';
import DashboardPage from '../Pages/Dashboard Page/DashboardPage';
import AuthPage from '../Pages/Auth Page/AuthPage';
import DestinationPage from '../Pages/Destination Page/DestinationPage';
import WeatherPage from '../Pages/WEATHER PAGE/WeatherPage';
import TransportationPlannerPage from '../Pages/TRANSPORTATION PLANNER PAGE/TransportationPlannerPage';
import SafetyEmergencyPage from '../Pages/SAFETY & EMERGENCY PAGE/SafetyEmergencyPage';
import SettingsPage from '../Pages/Setting page/SettingPage';
import TripOverviewDashboard from '../Pages/TRIP OVERVIEW DASHBOARD/TripOverviewDashboard';
import BudgetPlannerPage from '../Pages/BUDGET PLANNER PAGE/BudgetPlannerPage';
import ExpenseTrackerPage from '../Pages/EXPENSE TRACKER PAGE/ExpenseTrackerPage';
import NotificationsPage from '../Pages/NOTIFICATIONS PAGE/NotificationsPage';
import FlightsPage from '../Pages/Flights Page/FlightsPage';
import ProfilePage from '../Pages/Profile Page/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/weather-test" element={<WeatherTest />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/destinations" element={
              <ProtectedRoute>
                <DestinationPage />
              </ProtectedRoute>
            } />
            <Route path="/weather" element={
              <ProtectedRoute>
                <WeatherPage />
              </ProtectedRoute>
            } />
            <Route path="/transportation" element={
              <ProtectedRoute>
                <TransportationPlannerPage />
              </ProtectedRoute>
            } />
            <Route path="/safety" element={
              <ProtectedRoute>
                <SafetyEmergencyPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/trip-overview" element={
              <ProtectedRoute>
                <TripOverviewDashboard />
              </ProtectedRoute>
            } />
            <Route path="/budget" element={
              <ProtectedRoute>
                <BudgetPlannerPage />
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute>
                <ExpenseTrackerPage />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/flights" element={
              <ProtectedRoute>
                <FlightsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
