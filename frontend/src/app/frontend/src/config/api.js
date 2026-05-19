import axios from 'axios';

/** Base URL for REST calls. In Vite dev, use same-origin + proxy (see vite.config.js). */
function resolveApiBaseUrl() {
  if (import.meta.env.DEV) {
    return '/api/v1'
  }
  const raw = String(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000').trim()
  const base = raw.replace(/\/+$/, '')
  if (base.endsWith('/api/v1')) return base
  return `${base}/api/v1`
}

export const API_BASE_URL = resolveApiBaseUrl()

/** Live hotels are served at /api/hotels-live (not under /api/v1). */
function resolveHotelsLiveBaseUrl() {
  if (import.meta.env.DEV) {
    return '/api/hotels-live'
  }
  const raw = String(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000').trim()
  const base = raw.replace(/\/+$/, '').replace(/\/api\/v1\/?$/i, '')
  return `${base}/api/hotels-live`
}

export const HOTELS_LIVE_BASE_URL = resolveHotelsLiveBaseUrl()

function resolveTravelPackagesBaseUrl() {
  if (import.meta.env.DEV) {
    return '/api/travel-packages'
  }
  const raw = String(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000').trim()
  const base = raw.replace(/\/+$/, '').replace(/\/api\/v1\/?$/i, '')
  return `${base}/api/travel-packages`
}

export const TRAVEL_PACKAGES_BASE_URL = resolveTravelPackagesBaseUrl()

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    GOOGLE: `${API_BASE_URL}/auth/google`,
    DEV_GOOGLE: `${API_BASE_URL}/auth/dev-google`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    UPDATE_ME: `${API_BASE_URL}/auth/update-me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    VERIFY_RESET_OTP: `${API_BASE_URL}/auth/verify-reset-otp`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VALIDATE_RESET_TOKEN: (token) =>
      `${API_BASE_URL}/auth/reset-password/${encodeURIComponent(token)}`,
  },
  TRIPS: {
    BASE: `${API_BASE_URL}/trips`,
    BY_ID: (id) => `${API_BASE_URL}/trips/${id}`,
    ACTIVITIES: (tripId) => `${API_BASE_URL}/trips/${tripId}/activities`,
    EXPENSES: (tripId) => `${API_BASE_URL}/trips/${tripId}/expenses`,
  },
  FLIGHTS: {
    SEARCH: `${API_BASE_URL}/flights/search`,
  },
  HOTELS: {
    BASE: `${API_BASE_URL}/hotels`,
    BY_ID: (id) => `${API_BASE_URL}/hotels/${id}`,
  },
  HOTELS_LIVE: {
    BASE: HOTELS_LIVE_BASE_URL,
    BY_ID: (id) => `${HOTELS_LIVE_BASE_URL}/${encodeURIComponent(id)}`,
  },
  TRAVEL_PACKAGES: {
    BASE: TRAVEL_PACKAGES_BASE_URL,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  },
  CHAT: {
    BASE: `${API_BASE_URL}/chat`,
  },
  DESTINATIONS: {
    BASE: `${API_BASE_URL}/destinations`,
    POPULAR: `${API_BASE_URL}/destinations/popular`,
    FOR_YOU: `${API_BASE_URL}/destinations/for-you`,
    SUGGESTIONS: `${API_BASE_URL}/destinations/suggestions`,
  },
  AIRLINES: {
    BASE: `${API_BASE_URL}/airlines`,
  },
  TRANSPORT: {
    BASE: `${API_BASE_URL}/transport`,
  },
  WEATHER: {
    BASE: `${API_BASE_URL}/weather`,
  },
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/notifications`,
    MARK_READ: (id) => `${API_BASE_URL}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_BASE_URL}/notifications/read-all`,
  },
  SAFETY: {
    BASE: `${API_BASE_URL}/safety`,
  },
  EXPENSES: {
    BASE: `${API_BASE_URL}/expenses`,
    STATS: `${API_BASE_URL}/expenses/stats`,
    BY_ID: (id) => `${API_BASE_URL}/expenses/${id}`,
  },
  ESTIMATIONS: {
    BASE: `${API_BASE_URL}/estimation`,
    BY_ID: (id) => `${API_BASE_URL}/estimation/${id}`,
  },
  CONTACT: {
    SUBMIT: `${API_BASE_URL}/contact`,
  },
  FLIGHT_BOOKINGS: {
    BASE: `${API_BASE_URL}/flight-bookings`,
    BY_USER: (userId) => `${API_BASE_URL}/flight-bookings/user/${userId}`,
    CANCEL: (id) => `${API_BASE_URL}/flight-bookings/${id}/cancel`,
    BY_ID: (id) => `${API_BASE_URL}/flight-bookings/${id}`,
  },
  TRANSPORT_BOOKINGS: {
    BASE: `${API_BASE_URL}/transport-bookings`,
    BY_USER: (userId) => `${API_BASE_URL}/transport-bookings/user/${userId}`,
    CANCEL: (id) => `${API_BASE_URL}/transport-bookings/${id}/cancel`,
    BY_ID: (id) => `${API_BASE_URL}/transport-bookings/${id}`,
  },
};


export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};
