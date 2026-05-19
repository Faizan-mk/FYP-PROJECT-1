/** Pages & actions available from the dashboard quick search. */
export const DASHBOARD_SEARCH_PAGES = [
  { label: 'Destinations', path: '/destination', icon: '🗺️', terms: ['destination', 'places', 'explore', 'cities'] },
  { label: 'Tour packages', path: '/packages', icon: '🧳', terms: ['package', 'tour', 'agency'] },
  { label: 'Flights', path: '/traveler/flights', icon: '✈️', terms: ['flight', 'airline', 'fly', 'pia'] },
  { label: 'Hotels', path: '/traveler/hotels', icon: '🏨', terms: ['hotel', 'stay', 'accommodation'] },
  { label: 'Transport', path: '/transport', icon: '🚌', terms: ['bus', 'train', 'transport', 'daewoo'] },
  { label: 'My bookings', path: '/my-bookings', icon: '📑', terms: ['booking', 'reservation', 'ticket'] },
  { label: 'Cost estimator', path: '/cost-estimator', icon: '💰', terms: ['cost', 'estimate', 'budget', 'price'] },
  { label: 'Budget planner', path: '/budget-planner', icon: '📊', terms: ['budget', 'spending', 'plan'] },
  { label: 'Plan my trip', path: '/plan-my-trip', icon: '🧭', terms: ['plan', 'itinerary', 'trip'] },
  { label: 'Create trip', path: '/create-trip', icon: '✨', terms: ['new', 'create', 'trip'] },
  { label: 'Explore Pakistan', path: '/explore-pakistan', icon: '🏔️', terms: ['explore', 'pakistan', 'discover'] },
  { label: 'Trip overview', path: '/trip-overview', icon: '📋', terms: ['overview', 'itinerary', 'map'] },
  { label: 'Weather', path: '/weather', icon: '☁️', terms: ['weather', 'forecast', 'rain'] },
  { label: 'AI assistant', path: '/chatbot', icon: '🤖', terms: ['chat', 'ai', 'help', 'assistant'] },
  { label: 'Safety & emergency', path: '/safety-emergency', icon: '🛡️', terms: ['safety', 'emergency', 'sos'] },
  { label: 'Notifications', path: '/notifications', icon: '🔔', terms: ['notification', 'alert'] },
  { label: 'Settings', path: '/settings', icon: '⚙️', terms: ['settings', 'profile', 'account'] },
  { label: 'Past trips', path: '/past-trips', icon: '📅', terms: ['history', 'past', 'previous'] },
];

export function filterSearchPages(query) {
  const q = query.trim().toLowerCase();
  if (!q) return DASHBOARD_SEARCH_PAGES.slice(0, 6);
  return DASHBOARD_SEARCH_PAGES.filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      p.terms.some((t) => t.includes(q) || q.includes(t))
  );
}

export function normalizeDestinationList(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  return [];
}
