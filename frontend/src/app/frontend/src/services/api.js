import { API_ENDPOINTS, getAuthToken } from '../config/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    throw error;
  }
  return data;
};

const getHeaders = (customHeaders = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  get: async (url, options = {}) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(options.headers),
      ...options,
    });
    return handleResponse(response);
  },

  patch: async (url, data, options = {}) => {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(options.headers),
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  post: async (url, data, options = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(options.headers),
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  put: async (url, data, options = {}) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(options.headers),
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  delete: async (url, options = {}) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(options.headers),
      ...options,
    });
    return handleResponse(response);
  },
};

// Auth Service
export const authService = {
  login: async (email, password) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  },

  register: async (userData) => {
    return api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  getCurrentUser: async () => {
    return api.get(API_ENDPOINTS.AUTH.ME);
  },

  updateMe: async (userData) => {
    // Backend auth.routes.js exposes PATCH /auth/update-me
    return api.patch(API_ENDPOINTS.AUTH.UPDATE_ME, userData);
  },

  logout: async () => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};

// Trip Service
export const tripService = {
  getAllTrips: async () => {
    return api.get(API_ENDPOINTS.TRIPS.BASE);
  },

  getTripById: async (id) => {
    return api.get(API_ENDPOINTS.TRIPS.BY_ID(id));
  },

  createTrip: async (tripData) => {
    return api.post(API_ENDPOINTS.TRIPS.BASE, tripData);
  },

  updateTrip: async (id, tripData) => {
    return api.put(API_ENDPOINTS.TRIPS.BY_ID(id), tripData);
  },

  deleteTrip: async (id) => {
    return api.delete(API_ENDPOINTS.TRIPS.BY_ID(id));
  },

  // Add more trip-related methods as needed
};

// Chat Service
export const chatService = {
  sendMessage: async (message) => {
    return api.post(API_ENDPOINTS.CHAT.BASE, { message });
  },

  getChatHistory: async () => {
    return api.get(API_ENDPOINTS.CHAT.BASE);
  },
};

// Flights Service (frontend)
export const flightService = {
  searchFlights: async ({ from, to, date, pax = 1 }) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (date) params.append('date', date);
    if (pax) params.append('passengers', String(pax));

    const url = `${API_ENDPOINTS.FLIGHTS.SEARCH}?${params.toString()}`;
    const res = await api.get(url);

    const rawList = Array.isArray(res)
      ? res
      : res.flights || res.data?.flights || res.data || [];

    if (!Array.isArray(rawList)) return [];

    return rawList.map((item, index) => {
      const departureTime = item.departure?.time || item.departureTime;
      const arrivalTime = item.arrival?.time || item.arrivalTime;

      const formatTime = (value) => {
        if (!value) return '';
        try {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          return String(value);
        } catch {
          return String(value);
        }
      };

      return {
        id: item.id || item.flightNumber || `flight-${index}`,
        airline: item.airline?.name || item.airline || 'Unknown Airline',
        logo: '✈️',
        price: typeof item.price === 'number' ? item.price : null,
        duration: item.duration || '—',
        rating: item.rating || 4.0,
        departure: formatTime(departureTime),
        arrival: formatTime(arrivalTime),
        from: item.departure?.airport || item.from || '',
        to: item.arrival?.airport || item.to || '',
        bookingUrl: item.bookingUrl || 'https://www.google.com/travel/flights',
      };
    });
  },
};
// Hotel Service
export const hotelService = {
  getAllHotels: async () => {
    return api.get(API_ENDPOINTS.HOTELS.BASE);
  },

  createHotel: async (hotelData) => {
    return api.post(API_ENDPOINTS.HOTELS.BASE, hotelData);
  },
};

// Destination Service
export const destinationService = {
  getAllDestinations: async () => {
    return api.get(API_ENDPOINTS.DESTINATIONS.BASE);
  },

  createDestination: async (destinationData) => {
    return api.post(API_ENDPOINTS.DESTINATIONS.BASE, destinationData);
  },

  updateDestination: async (id, destinationData) => {
    return api.put(`${API_ENDPOINTS.DESTINATIONS.BASE}/${id}`, destinationData);
  },

  deleteDestination: async (id) => {
    return api.delete(`${API_ENDPOINTS.DESTINATIONS.BASE}/${id}`);
  },
};

// Airline Service
export const airlineService = {
  getAllAirlines: async () => {
    return api.get(API_ENDPOINTS.AIRLINES.BASE);
  },

  getAirlineById: async (id) => {
    return api.get(`${API_ENDPOINTS.AIRLINES.BASE}/${id}`);
  },

  createAirline: async (airlineData) => {
    return api.post(API_ENDPOINTS.AIRLINES.BASE, airlineData);
  },

  updateAirline: async (id, airlineData) => {
    return api.put(`${API_ENDPOINTS.AIRLINES.BASE}/${id}`, airlineData);
  },

  deleteAirline: async (id) => {
    return api.delete(`${API_ENDPOINTS.AIRLINES.BASE}/${id}`);
  },
};

// Transport Service
export const transportService = {
  getAllTransport: async () => {
    return api.get(API_ENDPOINTS.TRANSPORT.BASE);
  },

  getTransportById: async (id) => {
    return api.get(`${API_ENDPOINTS.TRANSPORT.BASE}/${id}`);
  },

  createTransport: async (transportData) => {
    return api.post(API_ENDPOINTS.TRANSPORT.BASE, transportData);
  },

  updateTransport: async (id, transportData) => {
    return api.put(`${API_ENDPOINTS.TRANSPORT.BASE}/${id}`, transportData);
  },

  deleteTransport: async (id) => {
    return api.delete(`${API_ENDPOINTS.TRANSPORT.BASE}/${id}`);
  },
};
