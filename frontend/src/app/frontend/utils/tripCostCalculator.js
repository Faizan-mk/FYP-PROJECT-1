/** Pakistan-focused trip cost model (PKR) for Cost Estimator & Budget Planner */

export const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta',
  'Multan', 'Faisalabad', 'Murree', 'Hunza', 'Skardu', 'Swat', 'Gwadar', 'Naran',
];

export const HOTEL_TIERS = [
  { id: 'budget', label: 'Budget (guest house)', perNight: 3500 },
  { id: 'standard', label: 'Standard (3★)', perNight: 7500 },
  { id: 'boutique', label: 'Boutique (4★)', perNight: 14000 },
  { id: 'luxury', label: 'Luxury (5★)', perNight: 28000 },
];

export const TRANSPORT_MODES = [
  { id: 'bus', label: 'Bus / coach', perDay: 1500 },
  { id: 'train', label: 'Train', perDay: 2000 },
  { id: 'car', label: 'Car rental', perDay: 8000 },
  { id: 'flight_connect', label: 'Domestic flight leg', perDay: 12000 },
];

export const FOOD_LEVELS = [
  { id: 'budget', label: 'Budget (local dhaba)', perDay: 1800 },
  { id: 'standard', label: 'Standard (restaurants)', perDay: 3200 },
  { id: 'premium', label: 'Premium dining', perDay: 5500 },
];

export const ACTIVITY_OPTIONS = [
  { id: 'sightseeing', label: 'City sightseeing', cost: 2000 },
  { id: 'museum', label: 'Museums & heritage', cost: 800 },
  { id: 'trekking', label: 'Trekking / hiking', cost: 5000 },
  { id: 'adventure', label: 'Adventure sports', cost: 8000 },
  { id: 'local_tour', label: 'Guided local tour', cost: 4500 },
  { id: 'shopping', label: 'Shopping & bazaars', cost: 3000 },
];

const NORTHERN = ['hunza', 'skardu', 'swat', 'naran', 'murree', 'gilgit', 'chitral'];
const MAJOR_HUBS = ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'peshawar'];

function normCity(name) {
  return String(name || '').trim().toLowerCase();
}

function isNorthern(city) {
  return NORTHERN.some((n) => normCity(city).includes(n));
}

function isMajorHub(city) {
  return MAJOR_HUBS.some((h) => normCity(city).includes(h));
}

/** Base one-way flight estimate per traveler (PKR) */
export function estimateFlightCost(origin, destination, travelers = 1) {
  const o = normCity(origin);
  const d = normCity(destination);
  if (!o || !d || o === d) return 0;

  let base = 12000;
  const oNorth = isNorthern(o);
  const dNorth = isNorthern(d);
  const oHub = isMajorHub(o);
  const dHub = isMajorHub(d);

  if (oHub && dHub) base = 14000;
  if (oNorth || dNorth) base = 18000;
  if (oNorth && dNorth) base = 22000;
  if ((o.includes('karachi') && d.includes('lahore')) || (o.includes('lahore') && d.includes('karachi'))) {
    base = 16000;
  }

  return Math.round(base * Math.max(1, Number(travelers) || 1));
}

export function calculateTripCost({
  origin = 'Islamabad',
  destination = 'Hunza',
  days = 5,
  travelers = 2,
  hotelTierId = 'standard',
  transportModeId = 'bus',
  foodLevelId = 'standard',
  activityIds = [],
}) {
  const d = Math.max(1, Number(days) || 1);
  const t = Math.max(1, Number(travelers) || 1);

  const hotel = HOTEL_TIERS.find((h) => h.id === hotelTierId) || HOTEL_TIERS[1];
  const transport = TRANSPORT_MODES.find((m) => m.id === transportModeId) || TRANSPORT_MODES[0];
  const food = FOOD_LEVELS.find((f) => f.id === foodLevelId) || FOOD_LEVELS[1];

  const destMultiplier = isNorthern(destination) ? 1.15 : 1;
  const nights = Math.max(1, d - 1);

  const flights = estimateFlightCost(origin, destination, t);
  const hotels = Math.round(hotel.perNight * nights * t * destMultiplier);
  const foodCost = Math.round(food.perDay * d * t * destMultiplier);
  const transportation = Math.round(transport.perDay * d * t);

  const activitiesList = ACTIVITY_OPTIONS.filter((a) => activityIds.includes(a.id));
  const activitiesTotal = activitiesList.reduce(
    (sum, a) => sum + Math.round(a.cost * t),
    0
  );

  const breakdown = [
    { key: 'flights', label: 'Flights', icon: '✈️', amount: flights, hint: `${origin} → ${destination}` },
    { key: 'hotels', label: 'Hotels', icon: '🏨', amount: hotels, hint: `${hotel.label} · ${nights} night(s)` },
    { key: 'food', label: 'Food', icon: '🍽️', amount: foodCost, hint: `${food.label} · ${d} day(s)` },
    { key: 'transport', label: 'Transportation', icon: '🚌', amount: transportation, hint: transport.label },
    { key: 'activities', label: 'Activities', icon: '🎯', amount: activitiesTotal, hint: activitiesList.map((a) => a.label).join(', ') || 'None selected' },
  ];

  const total = breakdown.reduce((s, b) => s + b.amount, 0);

  return {
    origin,
    destination,
    days: d,
    travelers: t,
    hotelTierId,
    transportModeId,
    foodLevelId,
    activityIds,
    breakdown,
    total,
  };
}

/** Budget planner: suggest downgrades when over budget */
export function getBudgetSuggestions(estimate, maxBudget) {
  const budget = Number(maxBudget) || 0;
  if (!estimate || budget <= 0) return { overBy: 0, suggestions: [], adjustedTotal: estimate?.total || 0 };

  const overBy = Math.max(0, estimate.total - budget);
  if (overBy <= 0) {
    return { overBy: 0, suggestions: [], adjustedTotal: estimate.total, withinBudget: true };
  }

  const suggestions = [];
  const current = { ...estimate };

  const tryHotel = () => {
    const tiers = HOTEL_TIERS;
    const idx = tiers.findIndex((h) => h.id === current.hotelTierId);
    if (idx > 0) {
      const next = tiers[idx - 1];
      const recalc = calculateTripCost({ ...current, hotelTierId: next.id });
      const save = current.total - recalc.total;
      if (save > 0) {
        suggestions.push({
          id: 'hotel',
          title: `Switch to ${next.label}`,
          save,
          newTotal: recalc.total,
          apply: () => ({ ...recalc, hotelTierId: next.id }),
        });
      }
    }
  };

  const tryTransport = () => {
    if (current.transportModeId === 'car' || current.transportModeId === 'flight_connect') {
      const recalc = calculateTripCost({ ...current, transportModeId: 'bus' });
      const save = current.total - recalc.total;
      if (save > 0) {
        suggestions.push({
          id: 'transport',
          title: 'Use bus/coach instead of car or flight leg',
          save,
          newTotal: recalc.total,
        });
      }
    }
  };

  const tryFood = () => {
    const levels = FOOD_LEVELS;
    const idx = levels.findIndex((f) => f.id === current.foodLevelId);
    if (idx > 0) {
      const next = levels[idx - 1];
      const recalc = calculateTripCost({ ...current, foodLevelId: next.id });
      const save = current.total - recalc.total;
      if (save > 0) {
        suggestions.push({
          id: 'food',
          title: `Choose ${next.label}`,
          save,
          newTotal: recalc.total,
        });
      }
    }
  };

  const tryActivities = () => {
    if (current.activityIds?.length > 0) {
      const cheaper = current.activityIds.filter((id) => !['adventure', 'trekking'].includes(id));
      if (cheaper.length < current.activityIds.length) {
        const recalc = calculateTripCost({ ...current, activityIds: cheaper.length ? cheaper : [] });
        const save = current.total - recalc.total;
        if (save > 0) {
          suggestions.push({
            id: 'activities',
            title: 'Drop premium activities (trekking / adventure)',
            save,
            newTotal: recalc.total,
          });
        }
      }
      if (current.activityIds.length > 1) {
        const recalc = calculateTripCost({ ...current, activityIds: [current.activityIds[0]] });
        const save = current.total - recalc.total;
        if (save > 0) {
          suggestions.push({
            id: 'activities_min',
            title: 'Keep only one main activity',
            save,
            newTotal: recalc.total,
          });
        }
      }
    }
  };

  const tryDays = () => {
    if (current.days > 3) {
      const recalc = calculateTripCost({ ...current, days: current.days - 1 });
      const save = current.total - recalc.total;
      if (save > 0) {
        suggestions.push({
          id: 'days',
          title: `Shorten trip by 1 day (${current.days - 1} days)`,
          save,
          newTotal: recalc.total,
        });
      }
    }
  };

  tryHotel();
  tryTransport();
  tryFood();
  tryActivities();
  tryDays();

  suggestions.sort((a, b) => b.save - a.save);

  let adjustedTotal = estimate.total;
  const applied = [];
  for (const s of suggestions) {
    if (adjustedTotal <= budget) break;
    adjustedTotal -= s.save;
    applied.push(s);
  }

  return {
    overBy,
    suggestions: suggestions.slice(0, 6),
    adjustedTotal: Math.max(adjustedTotal, 0),
    withinBudget: adjustedTotal <= budget,
  };
}

export const STORAGE_KEYS = {
  DRAFT: 'travelCostEstimatorDraft',
  RESULT: 'travelCostEstimationResult',
  BUDGET: 'travelBudgetPlannerData',
};

export function formatPkr(amount) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  })
    .format(Number(amount) || 0)
    .replace('PKR', 'PKR ');
}
