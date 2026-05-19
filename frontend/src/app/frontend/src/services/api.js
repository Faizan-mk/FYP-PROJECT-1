import { API_ENDPOINTS, getAuthToken, API_BASE_URL } from '../config/api';

async function fetchApi(url, options = {}) {
  const timeoutMs = options.timeoutMs ?? 20000;
  const { timeoutMs: _omit, ...fetchOptions } = options;
  const signal =
    fetchOptions.signal ??
    (typeof AbortSignal !== 'undefined' && AbortSignal.timeout
      ? AbortSignal.timeout(timeoutMs)
      : undefined);

  let response;
  try {
    response = await fetch(url, { ...fetchOptions, signal });
  } catch (err) {
    const baseHint = import.meta.env.DEV
      ? ' Start the API server (open a terminal → cd Backend → npm run dev). Requests use the Vite /api proxy to port 5000.'
      : ' Check VITE_API_URL and that the API server is running.';
    const msg = err?.message || 'Network error';
    throw new Error(`${msg}.${baseHint}`);
  }
  return handleResponse(response);
}

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text || 'Something went wrong' };
  }

  if (!response.ok) {
    // If it's a 404 HTML page, provide a cleaner message
    const message = typeof data.message === 'string' && data.message.includes('<!DOCTYPE')
      ? `Error ${response.status}: Request failed`
      : data.message;

    const error = new Error(message || 'Something went wrong');
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
    return fetchApi(url, {
      method: 'GET',
      headers: getHeaders(options.headers),
      ...options,
    });
  },

  patch: async (url, data, options = {}) => {
    return fetchApi(url, {
      method: 'PATCH',
      headers: getHeaders(options.headers),
      body: JSON.stringify(data),
      ...options,
    });
  },

  post: async (url, data, options = {}) => {
    return fetchApi(url, {
      method: 'POST',
      headers: getHeaders(options.headers),
      body: JSON.stringify(data),
      ...options,
    });
  },

  put: async (url, data, options = {}) => {
    return fetchApi(url, {
      method: 'PUT',
      headers: getHeaders(options.headers),
      body: JSON.stringify(data),
      ...options,
    });
  },

  delete: async (url, options = {}) => {
    return fetchApi(url, {
      method: 'DELETE',
      headers: getHeaders(options.headers),
      ...options,
    });
  },
};

// Auth Service
export const authService = {
  login: async (email, password) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
  },

  loginWithGoogle: async (idToken) => {
    return api.post(API_ENDPOINTS.AUTH.GOOGLE, { idToken });
  },

  /** Local dev only: one click, no Google Cloud project */
  loginWithGoogleDemo: async () => {
    return api.post(API_ENDPOINTS.AUTH.DEV_GOOGLE, {});
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

  forgotPassword: async (email) => {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, { timeoutMs: 25000 });
  },

  verifyResetOtp: async (email, otp) => {
    return api.post(API_ENDPOINTS.AUTH.VERIFY_RESET_OTP, { email, otp });
  },

  validateResetToken: async (token) => {
    return api.get(API_ENDPOINTS.AUTH.VALIDATE_RESET_TOKEN(token));
  },

  resetPassword: async (token, password) => {
    return api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
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
  sendMessage: async (message, context = []) => {
    return api.post(API_ENDPOINTS.CHAT.BASE, { message, context });
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
function normalizeLiveHotel(h) {
  if (!h || typeof h !== 'object') return h;
  const livePrice = h.livePrice ?? h.price ?? h.basePrice;
  return {
    ...h,
    price: livePrice != null ? Number(livePrice) : h.price,
  };
}

// Hotel Service
export const hotelService = {
  getAllHotels: async () => {
    return api.get(API_ENDPOINTS.HOTELS.BASE);
  },

  /** Live feed: prices & room counts refresh on the server ~every 30s. */
  getLiveHotels: async (params = {}) => {
    const qs = new URLSearchParams();
    if (params.city) qs.set('city', params.city);
    if (params.stars != null && params.stars !== 'all') qs.set('stars', String(params.stars));
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    const res = await api.get(`${API_ENDPOINTS.HOTELS_LIVE.BASE}${suffix}`);
    const list = Array.isArray(res?.data) ? res.data : [];
    return list.map(normalizeLiveHotel);
  },

  getHotelById: async (id) => {
    return api.get(API_ENDPOINTS.HOTELS.BY_ID(id));
  },

  getLiveHotelById: async (id) => {
    const res = await api.get(API_ENDPOINTS.HOTELS_LIVE.BY_ID(id));
    const inner = res?.data != null ? res.data : res;
    return normalizeLiveHotel(inner);
  },

  createHotel: async (hotelData) => {
    return api.post(API_ENDPOINTS.HOTELS.BASE, hotelData);
  },

  updateHotel: async (id, hotelData) => {
    return api.put(API_ENDPOINTS.HOTELS.BY_ID(id), hotelData);
  },

  deleteHotel: async (id) => {
    return api.delete(API_ENDPOINTS.HOTELS.BY_ID(id));
  },
};

/** Tour packages (live prices + offers from backend) */
export const travelPackageService = {
  getPackages: async ({ destination = '', type = '', limit = 60 } = {}) => {
    const qs = new URLSearchParams();
    if (destination) qs.set('destination', destination);
    if (type) qs.set('type', type);
    if (limit) qs.set('limit', String(limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return api.get(`${API_ENDPOINTS.TRAVEL_PACKAGES.BASE}${suffix}`, { cache: 'no-store' });
  },
};

// Destination Service
export const destinationService = {
  getAllDestinations: async () => {
    return api.get(API_ENDPOINTS.DESTINATIONS.BASE);
  },

  getPopularDestinations: async (limit = 6) => {
    return api.get(`${API_ENDPOINTS.DESTINATIONS.POPULAR}?limit=${limit}`);
  },

  getForYouDestinations: async ({ limit = 6, types = [], exclude = [] } = {}) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (types.length) params.set('types', types.join(','));
    if (exclude.length) params.set('exclude', exclude.join(','));
    return api.get(`${API_ENDPOINTS.DESTINATIONS.FOR_YOU}?${params}`);
  },

  getDestinationSuggestions: async (q = '', limit = 8, { types = [], exclude = [] } = {}) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (q.trim()) params.set('q', q.trim());
    if (types.length) params.set('types', types.join(','));
    if (exclude.length) params.set('exclude', exclude.join(','));
    return api.get(`${API_ENDPOINTS.DESTINATIONS.SUGGESTIONS}?${params}`);
  },

  getDestinationById: async (id) => {
    return api.get(`${API_ENDPOINTS.DESTINATIONS.BASE}/${encodeURIComponent(id)}`);
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

/** Parse GET /notifications response into a plain array. */
export function parseNotificationsList(res) {
  const body = res?.data ?? res;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

export function isNotificationUnread(n) {
  return n?.isRead !== true && n?.isRead !== 1;
}

export function countUnreadNotifications(list) {
  return (Array.isArray(list) ? list : []).filter(isNotificationUnread).length;
}

export function syncNotificationBadge(count) {
  const n = Math.max(0, Number(count) || 0);
  localStorage.setItem('notificationsCount', String(n));
  window.dispatchEvent(new CustomEvent('notifications:update', { detail: n }));
}

// Notification Service
export const notificationService = {
  getNotifications: async () => {
    return api.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
  },

  getNotificationsList: async () => {
    const res = await api.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
    return parseNotificationsList(res);
  },

  markAsRead: async (id) => {
    return api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  markAllAsRead: async () => {
    return api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },

  deleteNotification: async (id) => {
    return api.delete(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}`);
  },

  clearAll: async () => {
    return api.delete(API_ENDPOINTS.NOTIFICATIONS.BASE);
  },
};

// User Service
export const userService = {
  getMe: async () => {
    return api.get(API_ENDPOINTS.AUTH.ME);
  },
  updateProfile: async (userData) => {
    return api.put(`${API_BASE_URL}/users/profile`, userData);
  },
  updatePassword: async (passwordData) => {
    return api.put(`${API_BASE_URL}/users/password`, passwordData);
  },
};
// Safety Service
export const safetyService = {
  getSafetyData: async (destination) => {
    return api.get(`${API_ENDPOINTS.SAFETY.BASE}${destination ? `?destination=${destination}` : ''}`);
  },
};

// Expense Service
export const expenseService = {
  getExpenses: async () => {
    return api.get(API_ENDPOINTS.EXPENSES.BASE);
  },
  getStats: async () => {
    return api.get(API_ENDPOINTS.EXPENSES.STATS);
  },
  createExpense: async (expenseData) => {
    return api.post(API_ENDPOINTS.EXPENSES.BASE, expenseData);
  },
  deleteExpense: async (id) => {
    return api.delete(API_ENDPOINTS.EXPENSES.BY_ID(id));
  }
};

// Estimation Service
export const estimationService = {
  getEstimations: async () => {
    return api.get(API_ENDPOINTS.ESTIMATIONS.BASE);
  },
  saveEstimation: async (estimationData) => {
    return api.post(API_ENDPOINTS.ESTIMATIONS.BASE, estimationData);
  },
  deleteEstimation: async (id) => {
    return api.delete(API_ENDPOINTS.ESTIMATIONS.BY_ID(id));
  }
};

export function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || user._id || null;
  } catch {
    return null;
  }
}

export const contactService = {
  sendMessage: async ({ name, email, subject, message }) => {
    return api.post(API_ENDPOINTS.CONTACT.SUBMIT, { name, email, subject, message });
  },
};

export const bookingService = {
  getFlightBookings: async () => {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const res = await api.get(API_ENDPOINTS.FLIGHT_BOOKINGS.BY_USER(userId));
    return Array.isArray(res) ? res : res?.data || [];
  },
  cancelFlightBooking: async (id, reason = 'Cancelled by user') => {
    return api.put(API_ENDPOINTS.FLIGHT_BOOKINGS.CANCEL(id), { cancellationReason: reason });
  },
  getTransportBookings: async () => {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const res = await api.get(API_ENDPOINTS.TRANSPORT_BOOKINGS.BY_USER(userId));
    return Array.isArray(res) ? res : res?.data || [];
  },
  cancelTransportBooking: async (id) => {
    return api.put(API_ENDPOINTS.TRANSPORT_BOOKINGS.CANCEL(id), {});
  },
};
