# ✈️ Pakistan Airlines Flight Search System

This is a NEW, AI-Travel Planner focused flight search system for Pakistan. It features real-time price updates, live flight tracking, and secure airline redirects.

## 🚀 How to Run Locally

### 1. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Configure your `.env` file with your MySQL credentials.
4. Start the server:
   ```bash
   npm start
   ```
   *Note: On the first run, the system will automatically seed 5 major Pakistan airlines (PIA, Airblue, SereneAir, AirSial, Fly Jinnah) and sample flight data.*

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173/flights`.

## 🛠️ System Features

### 📡 Real-Time Data Engine
- **Live Pricing**: Prices fluctuate ±8% every 60 seconds using a time-seeded secondary algorithm.
- **Auto-Refresh**: The frontend search page refreshes automatically Every 60 seconds with a countdown timer.
- **Flight Status**: Real-time status detection (On Time, Boarding, Delayed, Departed).
- **Seat Availability**: Dynamic seat counter with urgency warnings when seats are low.

### 🔒 Security & Tracking
- **Safe Redirects**: Airline URLs are never exposed to the frontend.
- **Click Logging**: Every redirect is logged in the `flight_clicks` table with IP and User Agent data.

## 📂 Folder Structure
- `Backend/model/pakFlightsIndex.js`: Database associations.
- `Backend/controller/pakFlightsController.js`: The "brain" of the real-time engine.
- `frontend/src/app/frontend/Pages/Traveler Flights Page/TravelerFlightsPage.jsx`: The main grid of Pakistan airlines.
- `frontend/src/app/frontend/Pages/Flights Page/FlightSearchPage.jsx`: The per-airline live search interface.
