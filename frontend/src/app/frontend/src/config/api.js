import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

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
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    UPDATE_ME: `${API_BASE_URL}/auth/update-me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
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
  },
  AIRLINES: {
    BASE: `${API_BASE_URL}/airlines`,
  },
  TRANSPORT: {
    BASE: `${API_BASE_URL}/transport`,
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
