import {
  ACTIVITY_OPTIONS,
  FOOD_LEVELS,
  HOTEL_TIERS,
  TRANSPORT_MODES,
} from './tripCostCalculator'

/** Curated day plans keyed by destination (Pakistan-focused). */
const DESTINATION_GUIDES = {
  hunza: {
    type: 'Mountain',
    highlights: [
      'Karimabad Bazaar & Baltit Fort viewpoint',
      'Attabad Lake boat ride & photography',
      'Eagle\'s Nest sunset over Hunza Valley',
      'Passu Cones & Hussaini suspension bridge',
      'Local apricot orchards & Hunza cuisine',
    ],
    food: 'Try chapshuro, diram-fitti, and apricot cake at Karimabad cafés.',
    tip: 'Carry layers; evenings cool quickly even in summer.',
  },
  skardu: {
    type: 'Mountain',
    highlights: [
      'Shangrila Resort (Lower Kachura) & lake walk',
      'Upper Kachura Lake half-day excursion',
      'Skardu Bazaar & Kharpocho Fort views',
      'Deosai plateau day trip (seasonal)',
      'Satpara Lake scenic drive',
    ],
    food: 'Trout at lake-side restaurants is a local favourite.',
    tip: 'Confirm Deosai road status before booking a jeep.',
  },
  swat: {
    type: 'Mountain',
    highlights: [
      'Malam Jabba chairlift & meadow walk',
      'Mahodand Lake day trip',
      'Mingora & Saidu Sharif bazaars',
      'White Palace Marghazar heritage stop',
      'Swat River riverside evening stroll',
    ],
    food: 'Sample Pushtun-style karahi and fresh trout in Mingora.',
    tip: 'Weekends at Malam Jabba are busy — go early.',
  },
  naran: {
    type: 'Mountain',
    highlights: [
      'Saif-ul-Mulook Lake jeep track (weather permitting)',
      'Lulusar Lake en route photography stops',
      'Naran Bazaar & gear check for lake trip',
      'Kunhar River walk at sunset',
      'Rest day buffer for mountain weather',
    ],
    food: 'Hot soup and grilled trout after the lake run.',
    tip: 'Lake road closes in heavy rain — keep Day 2 flexible.',
  },
  murree: {
    type: 'Mountain',
    highlights: [
      'Mall Road walk & Patriata (New Murree)',
      'Pindi Point / Kashmir Point viewpoints',
      'Ayubia chairlift & pipeline trek',
      'Local confectionery & hill-station cafés',
    ],
    food: 'Corn on the cob and pakoras on Mall Road.',
    tip: 'Friday traffic from Islamabad is heavy — leave early.',
  },
  lahore: {
    type: 'City',
    highlights: [
      'Badshahi Mosque & Lahore Fort (UNESCO core)',
      'Walled City food walk — Gawalmandi / Fort Road',
      'Shalimar Gardens & Mughal heritage trail',
      'Lahore Museum or Anarkali bazaar',
      'Food Street dinner & Data Darbar area (respectful visit)',
    ],
    food: 'Butt Karahi, nihari breakfast, and falooda on Food Street.',
    tip: 'Book Fort tickets online on public holidays.',
  },
  karachi: {
    type: 'City',
    highlights: [
      'Clifton Beach & Sea View promenade',
      'Mohatta Palace / Quaid-e-Azam Mausoleum',
      'Saddar & Empress Market heritage walk',
      'Port Grand or Do Darya seafood dinner',
      'Boat Basin street food evening',
    ],
    food: 'Biryani at Student Biryani or BBQ at Do Darya.',
    tip: 'Avoid peak traffic 5–8 PM between districts.',
  },
  islamabad: {
    type: 'City',
    highlights: [
      'Faisal Mosque & Margalla Hills Trail 3',
      'Pakistan Monument & Lok Virsa Museum',
      'Centaurus / F-6 café scene',
      'Daman-e-Koh viewpoint before sunset',
      'Rose & Jasmine Garden (seasonal blooms)',
    ],
    food: 'Street tacos in F-7 and chai at Savour Foods.',
    tip: 'Margalla trails are best in early morning.',
  },
  peshawar: {
    type: 'Culture',
    highlights: [
      'Qissa Khwani Bazaar heritage walk',
      'Peshawar Museum & Mahabat Khan Mosque',
      'Khyber Pass viewpoint (guided, ID required)',
      'Chapli kebab trail in Saddar',
    ],
    food: 'Chapli kebab with qahwa in the old city.',
    tip: 'Dress modestly in bazaar areas; carry CNIC.',
  },
  gwadar: {
    type: 'Beach',
    highlights: [
      'Hammerhead peninsula viewpoint',
      'Kund Malir / Hingol National Park coastal drive',
      'Gwadar West Bay promenade',
      'Fresh seafood harbour lunch',
    ],
    food: 'Grilled fish at harbour restaurants.',
    tip: 'Coastal highway legs need a full tank of fuel.',
  },
  multan: {
    type: 'Culture',
    highlights: [
      'Shah Rukn-e-Alam Shrine & old city gates',
      'Multan Fort ruins & blue-tile tombs',
      'Ghanta Ghar clock tower bazaar',
      'Sohan halwa factory visit',
    ],
    food: 'Buy Sohan halwa as gifts; try sajji locally.',
    tip: 'Afternoons are hot — plan indoor sites noon–4 PM.',
  },
  faisalabad: {
    type: 'City',
    highlights: [
      'Clock Tower (Ghanta Ghar) eight bazaars',
      'Jinnah Garden & Lyallpur Museum',
      'Local textile market browse',
    ],
    food: 'Dhaba-style dal chawal near the clock tower.',
    tip: 'Markets are most lively after 4 PM.',
  },
  quetta: {
    type: 'Desert',
    highlights: [
      'Hanna Urak Valley day trip',
      'Quaid-e-Azam residency Ziarat (long day)',
      'Kandahari bazaar dried fruit shopping',
      'Polo / football local match (if scheduled)',
    ],
    food: 'Kandahari grapes and sajji in winter season.',
    tip: 'Check road security advisories for day trips.',
  },
}

const ACTIVITY_ITINERARY = {
  sightseeing: { slot: '10:00', title: 'Guided city sightseeing', detail: 'Cover main landmarks with a local guide.' },
  museum: { slot: '11:00', title: 'Museum & heritage visit', detail: 'Reserve 2–3 hours; closed some Mondays.' },
  trekking: { slot: '07:00', title: 'Trek / hike', detail: 'Start early; pack water, snacks, and sun protection.' },
  adventure: { slot: '09:00', title: 'Adventure activity', detail: 'Confirm operator safety gear and weather window.' },
  local_tour: { slot: '10:30', title: 'Guided local tour', detail: 'Ask for neighbourhood food stops on the route.' },
  shopping: { slot: '16:00', title: 'Bazaar & shopping', detail: 'Best deals late afternoon; carry cash in smaller notes.' },
}

function normKey(name) {
  return String(name || '').trim().toLowerCase()
}

function matchGuide(destination) {
  const key = normKey(destination)
  for (const [slug, guide] of Object.entries(DESTINATION_GUIDES)) {
    if (key.includes(slug)) return { slug, ...guide }
  }
  return {
    slug: 'default',
    type: 'Adventure',
    highlights: [
      'Morning orientation walk in the main town',
      'Top viewpoint or heritage site',
      'Local market & street food stop',
      'Evening rest or riverside stroll',
    ],
    food: 'Ask your hotel for trusted local eateries.',
    tip: 'Save offline maps — signal can be weak in remote areas.',
  }
}

function addDays(baseDate, offset) {
  const d = new Date(baseDate)
  d.setDate(d.getDate() + offset)
  return d
}

function formatDayDate(date) {
  if (!date || Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-PK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function transportLabel(estimate, transportBooked) {
  if (transportBooked?.from && transportBooked?.to) {
    const mode = transportBooked.mode?.label || transportBooked.provider || 'Transport'
    return `${mode}: ${transportBooked.from} → ${transportBooked.to}`
  }
  const mode = TRANSPORT_MODES.find((m) => m.id === estimate?.transportModeId)
  return mode?.label || 'Bus / coach'
}

function hotelLabel(estimate) {
  const tier = HOTEL_TIERS.find((h) => h.id === estimate?.hotelTierId)
  return tier?.label || 'Standard (3★)'
}

function foodLabel(estimate) {
  const level = FOOD_LEVELS.find((f) => f.id === estimate?.foodLevelId)
  return level?.label || 'Standard restaurants'
}

function item(time, icon, title, detail = '') {
  return { time, icon, title, detail }
}

/**
 * Build a rich day-by-day itinerary from trip context.
 */
export function buildTripItinerary({
  days = 3,
  startDate = null,
  origin = 'Islamabad',
  destination = 'Hunza',
  destinations = [],
  estimate = null,
  transportBooked = null,
  flightBookings = [],
  transportBookings = [],
  travelers = 1,
}) {
  const totalDays = Math.max(1, Number(days) || estimate?.days || 3)
  const destList =
    destinations.length > 0
      ? destinations.map((d) => d.name).filter(Boolean)
      : [destination]

  const primaryDest = destList[0] || destination
  const guide = matchGuide(primaryDest)
  const highlights = [...guide.highlights]
  const selectedActivities = ACTIVITY_OPTIONS.filter((a) =>
    (estimate?.activityIds || []).includes(a.id)
  )

  const tripStart = startDate ? new Date(startDate) : null
  const hasValidStart = tripStart && !Number.isNaN(tripStart.getTime())

  const latestFlight = flightBookings[0]
  const latestTransport = transportBookings[0]
  const travelMode = transportLabel(estimate, transportBooked)
  const stayLabel = hotelLabel(estimate)
  const mealPlan = foodLabel(estimate)

  const itinerary = []

  for (let i = 0; i < totalDays; i++) {
    const dayNum = i + 1
    const dayDate = hasValidStart ? addDays(tripStart, i) : null
    const dateLabel = formatDayDate(dayDate)
    const isFirst = i === 0
    const isLast = i === totalDays - 1
    const isMiddle = !isFirst && !isLast

    let theme = 'Explore'
    const items = []

    if (isFirst) {
      theme = 'Arrival & check-in'
      if (latestFlight?.from && latestFlight?.to) {
        items.push(
          item(
            latestFlight.departure || 'Morning',
            '✈️',
            `Flight ${latestFlight.from} → ${latestFlight.to}`,
            `${latestFlight.airlineName || latestFlight.airline || 'Airline'} · ${latestFlight.departureDate || 'Confirm PNR in My Bookings'}`
          )
        )
      } else if (estimate?.transportModeId === 'flight_connect' || normKey(origin) !== normKey(primaryDest)) {
        items.push(
          item('07:00', '✈️', `Fly ${origin} → ${primaryDest}`, 'Check in 90 min early; domestic baggage 20 kg typical.')
        )
      } else {
        items.push(
          item('08:00', '🚌', `Depart ${origin} for ${primaryDest}`, travelMode)
        )
      }

      if (latestTransport?.from) {
        items.push(
          item(
            '12:00',
            '🚌',
            `Coach ${latestTransport.from} → ${latestTransport.to}`,
            `${latestTransport.provider || 'Operator'} · ref ${latestTransport.bookingReference || '—'}`
          )
        )
      }

      items.push(
        item('14:00', '🏨', 'Hotel check-in', `${stayLabel} · ${travelers} traveler(s)`),
        item('16:00', '🚶', 'Light neighbourhood walk', 'Recover from travel; locate ATMs and pharmacy.'),
        item('19:00', '🍽️', 'Welcome dinner', mealPlan)
      )
    } else if (isLast) {
      theme = 'Departure day'
      items.push(
        item('08:00', '☕', 'Breakfast & checkout', 'Settle minibar and late-checkout fees.'),
        item('10:00', '🛍️', 'Last-minute souvenirs', `Local crafts or dried fruit near ${primaryDest}.`)
      )

      if (destList.length > 1 && totalDays > 2) {
        items.push(
          item('12:00', '🗺️', `Short stop — ${destList[destList.length - 1]}`, 'Photo stop en route to hub.')
        )
      }

      if (latestFlight?.from) {
        items.push(
          item(
            '15:00',
            '✈️',
            `Return flight to ${origin}`,
            `${latestFlight.to} → ${origin} · confirm gate 2 hours ahead`
          )
        )
      } else {
        items.push(
          item('15:00', '🚌', `Return to ${origin}`, travelMode)
        )
      }

      items.push(
        item('20:00', '🏠', 'Trip complete', 'Upload expenses and save memories in Past Trips.')
      )
    } else {
      const highlightIdx = (i - 1) % highlights.length
      const highlight = highlights[highlightIdx]
      theme = highlight.includes('Lake') || highlight.includes('lake')
        ? 'Nature & lakes'
        : highlight.includes('Bazaar') || highlight.includes('bazaar')
          ? 'Culture & markets'
          : 'Sightseeing'

      items.push(
        item('08:00', '☕', 'Breakfast at hotel', mealPlan),
        item('09:30', '📍', highlight, guide.tip)
      )

      const act = selectedActivities[(i - 1) % Math.max(selectedActivities.length, 1)]
      if (act && ACTIVITY_ITINERARY[act.id]) {
        const block = ACTIVITY_ITINERARY[act.id]
        items.push(item(block.slot, '🎯', block.title, block.detail))
      } else if (selectedActivities.length === 0) {
        items.push(
          item('14:00', '🏛️', 'Afternoon landmark visit', 'See Trip Overview map for your base.')
        )
      }

      if (destList.length > 1 && i < destList.length) {
        items.push(
          item('17:00', '🚗', `Transfer toward ${destList[i] || destList[destList.length - 1]}`, 'Allow buffer for mountain roads.')
        )
      } else {
        items.push(
          item('17:30', '🌅', 'Sunset viewpoint or old town stroll', 'Ask hotel for the safest evening route.'),
          item('19:30', '🍽️', 'Dinner — local speciality', guide.food)
        )
      }
    }

    itinerary.push({
      day: `Day ${dayNum}`,
      dateLabel,
      theme,
      location: isMiddle && destList.length > 1
        ? destList[Math.min(i, destList.length - 1)]
        : primaryDest,
      items,
    })
  }

  return itinerary
}
