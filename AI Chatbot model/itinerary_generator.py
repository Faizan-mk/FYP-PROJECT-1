"""
Day-by-day itinerary generator for the AI Travel Guide chatbot.
Mirrors frontend buildTripItinerary.js logic.
"""
import re
from travel_knowledge import PAKISTAN_CITIES, INTERNATIONAL_CITIES

DESTINATION_GUIDES = {
    'hunza': {
        'type': 'Mountain',
        'highlights': [
            'Karimabad Bazaar & Baltit Fort viewpoint',
            'Attabad Lake boat ride & photography',
            "Eagle's Nest sunset over Hunza Valley",
            'Passu Cones & Hussaini suspension bridge',
            'Local apricot orchards & Hunza cuisine',
        ],
        'food': 'Try chapshuro, diram-fitti, and apricot cake at Karimabad cafés.',
        'tip': 'Carry layers; evenings cool quickly even in summer.',
    },
    'skardu': {
        'type': 'Mountain',
        'highlights': [
            'Shangrila Resort (Lower Kachura) & lake walk',
            'Upper Kachura Lake half-day excursion',
            'Skardu Bazaar & Kharpocho Fort views',
            'Deosai plateau day trip (seasonal)',
            'Satpara Lake scenic drive',
        ],
        'food': 'Trout at lake-side restaurants is a local favourite.',
        'tip': 'Confirm Deosai road status before booking a jeep.',
    },
    'swat': {
        'type': 'Mountain',
        'highlights': [
            'Malam Jabba chairlift & meadow walk',
            'Mahodand Lake day trip',
            'Mingora & Saidu Sharif bazaars',
            'White Palace Marghazar heritage stop',
            'Swat River riverside evening stroll',
        ],
        'food': 'Sample Pushtun-style karahi and fresh trout in Mingora.',
        'tip': 'Weekends at Malam Jabba are busy — go early.',
    },
    'naran': {
        'type': 'Mountain',
        'highlights': [
            'Saif-ul-Mulook Lake jeep track (weather permitting)',
            'Lulusar Lake en route photography stops',
            'Naran Bazaar & gear check for lake trip',
            'Kunhar River walk at sunset',
            'Rest day buffer for mountain weather',
        ],
        'food': 'Hot soup and grilled trout after the lake run.',
        'tip': 'Lake road closes in heavy rain — keep Day 2 flexible.',
    },
    'murree': {
        'type': 'Mountain',
        'highlights': [
            'Mall Road walk & Patriata (New Murree)',
            'Pindi Point / Kashmir Point viewpoints',
            'Ayubia chairlift & pipeline trek',
            'Local confectionery & hill-station cafés',
        ],
        'food': 'Corn on the cob and pakoras on Mall Road.',
        'tip': 'Friday traffic from Islamabad is heavy — leave early.',
    },
    'lahore': {
        'type': 'City',
        'highlights': [
            'Badshahi Mosque & Lahore Fort (UNESCO core)',
            'Walled City food walk — Gawalmandi / Fort Road',
            'Shalimar Gardens & Mughal heritage trail',
            'Lahore Museum or Anarkali bazaar',
            'Food Street dinner & heritage quarter',
        ],
        'food': 'Butt Karahi, nihari breakfast, and falooda on Food Street.',
        'tip': 'Book Fort tickets online on public holidays.',
    },
    'karachi': {
        'type': 'City',
        'highlights': [
            'Clifton Beach & Sea View promenade',
            'Mohatta Palace / Quaid-e-Azam Mausoleum',
            'Saddar & Empress Market heritage walk',
            'Port Grand or Do Darya seafood dinner',
            'Boat Basin street food evening',
        ],
        'food': 'Biryani at Student Biryani or BBQ at Do Darya.',
        'tip': 'Avoid peak traffic 5–8 PM between districts.',
    },
    'islamabad': {
        'type': 'City',
        'highlights': [
            'Faisal Mosque & Margalla Hills Trail 3',
            'Pakistan Monument & Lok Virsa Museum',
            'Centaurus / F-6 café scene',
            'Daman-e-Koh viewpoint before sunset',
            'Rose & Jasmine Garden (seasonal blooms)',
        ],
        'food': 'Street tacos in F-7 and chai at Savour Foods.',
        'tip': 'Margalla trails are best in early morning.',
    },
    'peshawar': {
        'type': 'Culture',
        'highlights': [
            'Qissa Khwani Bazaar heritage walk',
            'Peshawar Museum & Mahabat Khan Mosque',
            'Khyber Pass viewpoint (guided, ID required)',
            'Chapli kebab trail in Saddar',
        ],
        'food': 'Chapli kebab with qahwa in the old city.',
        'tip': 'Dress modestly in bazaar areas; carry CNIC.',
    },
    'gwadar': {
        'type': 'Beach',
        'highlights': [
            'Hammerhead peninsula viewpoint',
            'Kund Malir / Hingol National Park coastal drive',
            'Gwadar West Bay promenade',
            'Fresh seafood harbour lunch',
        ],
        'food': 'Grilled fish at harbour restaurants.',
        'tip': 'Coastal highway legs need a full tank of fuel.',
    },
    'dubai': {
        'type': 'International',
        'highlights': [
            'Burj Khalifa & Dubai Mall (At the Top tickets)',
            'Old Dubai — Al Fahidi, abra creek crossing, Gold Souk',
            'Desert safari with BBQ dinner (evening)',
            'Dubai Marina walk & JBR Beach',
            'Museum of the Future or Palm Jumeirah monorail',
        ],
        'food': 'Shawarma at Ravi Restaurant, Arabic mezze in Deira.',
        'tip': 'Book Burj Khalifa slots online; metro NOL card saves taxi fares.',
    },
    'istanbul': {
        'type': 'International',
        'highlights': [
            'Hagia Sophia & Blue Mosque (Sultanahmet)',
            'Topkapi Palace & Basilica Cistern',
            'Grand Bazaar & Spice Bazaar',
            'Bosphorus ferry cruise (full loop)',
            'Galata Tower & Istiklal Street evening',
        ],
        'food': 'Simit breakfast, kebap in Sultanahmet, fish sandwich by Galata Bridge.',
        'tip': 'Buy Istanbulkart for tram; mosques require modest dress.',
    },
    'bangkok': {
        'type': 'International',
        'highlights': [
            'Grand Palace & Wat Pho (Reclining Buddha)',
            'Chao Phraya river boat & Wat Arun',
            'Chatuchak Market (weekend) or floating market day trip',
            'Sukhumvit street food evening',
            'Ayutthaya or Jim Thompson House (culture day)',
        ],
        'food': 'Pad thai, mango sticky rice, rooftop dinner in Silom.',
        'tip': 'Dress covered shoulders/knees for temples; use BTS Skytrain.',
    },
}

ALL_CITY_NAMES = sorted(
    set(PAKISTAN_CITIES + INTERNATIONAL_CITIES),
    key=lambda x: -len(x),
)

ITINERARY_KEYWORDS = re.compile(
    r'\b(itinerary|itineraries|day\s*plan|day\s*by\s*day|schedule|'
    r'trip\s*plan|plan\s*my\s*trip|generate\s*plan|make\s*plan|'
    r'daily\s*plan|tour\s*plan)\b',
    re.I,
)

DAY_PATTERNS = [
    re.compile(r'(\d+)\s*[-]?\s*day(?:s)?(?:\s+trip|\s+itinerary|\s+plan|\s+tour)?', re.I),
    re.compile(r'for\s+(\d+)\s+days?', re.I),
    re.compile(r'(\d+)\s+days?\s+(?:in|to|for|at)\s+', re.I),
    re.compile(r'(\d+)\s+days?\b', re.I),
]


def _norm(s: str) -> str:
    return re.sub(r'\s+', ' ', (s or '').strip().lower())


def match_guide(destination: str) -> dict:
    key = _norm(destination)
    for slug, guide in DESTINATION_GUIDES.items():
        if slug in key:
            return {'slug': slug, **guide}
    return {
        'slug': 'default',
        'type': 'Adventure',
        'highlights': [
            'Morning orientation walk in the main town',
            'Top viewpoint or heritage site',
            'Local market & street food stop',
            'Evening rest or riverside stroll',
        ],
        'food': 'Ask your hotel for trusted local eateries.',
        'tip': 'Save offline maps — signal can be weak in remote areas.',
    }


def extract_destination(text: str) -> str | None:
    lower = _norm(text)
    for city in ALL_CITY_NAMES:
        if _norm(city) in lower:
            return city
    # "to hunza", "in dubai"
    m = re.search(r'(?:to|in|for|visit)\s+([a-z][a-z\s-]{2,28})', lower)
    if m:
        candidate = m.group(1).strip().title()
        for city in ALL_CITY_NAMES:
            if _norm(city) == _norm(candidate) or _norm(city) in _norm(candidate):
                return city
    return None


def extract_days(text: str) -> int | None:
    for pat in DAY_PATTERNS:
        m = pat.search(text)
        if m:
            n = int(m.group(1))
            if 1 <= n <= 21:
                return n
    return None


def _itinerary_uses_context(text: str) -> bool:
    """Only stitch chat history when this message is itinerary-related or a short follow-up."""
    if not text:
        return False
    lower = _norm(text)
    if ITINERARY_KEYWORDS.search(lower):
        return True
    if extract_days(text) or extract_destination(text):
        return True
    words = lower.split()
    if len(words) <= 4 and any(w in lower for w in ('day', 'days', 'plan', 'trip')):
        return True
    return False


def parse_itinerary_request(text: str, context: list = None) -> dict:
    """
    Returns:
      action: 'generate' | 'ask_days' | 'ask_destination' | None
      days, destination, origin
    """
    combined = text or ''
    if context and _itinerary_uses_context(text):
        for msg in reversed(context[-4:]):
            if msg.get('role') == 'user' and msg.get('text'):
                combined = f"{msg.get('text')} {combined}"
                break

    lower = _norm(combined)
    wants_itinerary = bool(ITINERARY_KEYWORDS.search(lower)) or (
        extract_days(combined) is not None and extract_destination(combined) is not None
    )

    if not wants_itinerary:
        # "5 days hunza" without keyword
        days = extract_days(combined)
        dest = extract_destination(combined)
        if days and dest and any(w in lower for w in ('plan', 'trip', 'visit', 'tour', 'stay')):
            wants_itinerary = True

    if not wants_itinerary:
        return {'action': None}

    days = extract_days(combined)
    destination = extract_destination(combined)
    origin = 'Islamabad'
    if 'from lahore' in lower:
        origin = 'Lahore'
    elif 'from karachi' in lower:
        origin = 'Karachi'

    if not destination:
        return {'action': 'ask_destination', 'days': days, 'origin': origin}

    if not days:
        return {'action': 'ask_days', 'destination': destination, 'origin': origin}

    return {
        'action': 'generate',
        'days': min(max(days, 1), 14),
        'destination': destination,
        'origin': origin,
    }


def _item(time: str, icon: str, title: str, detail: str = '') -> dict:
    return {'time': time, 'icon': icon, 'title': title, 'detail': detail}


def build_itinerary(days: int, destination: str, origin: str = 'Islamabad') -> list:
    total_days = max(1, min(int(days), 14))
    guide = match_guide(destination)
    highlights = list(guide['highlights'])
    primary = destination
    itinerary = []

    for i in range(total_days):
        day_num = i + 1
        is_first = i == 0
        is_last = i == total_days - 1
        items = []

        if is_first:
            theme = 'Arrival & check-in'
            if _norm(origin) != _norm(primary):
                items.append(_item('07:00', '✈️', f'Travel {origin} → {primary}', 'Book flights or Daewoo/Faisal Movers in the app.'))
            else:
                items.append(_item('08:00', '🚌', f'Local transfer within {primary}', 'Careem/Uber or hotel pickup.'))
            items.extend([
                _item('14:00', '🏨', 'Hotel check-in', 'Standard 3★ — upgrade in Hotels section if needed.'),
                _item('16:00', '🚶', 'Light neighbourhood walk', guide['tip']),
                _item('19:00', '🍽️', 'Welcome dinner', guide['food']),
            ])
        elif is_last:
            theme = 'Departure day'
            items.extend([
                _item('08:00', '☕', 'Breakfast & checkout', 'Settle hotel bill and store luggage.'),
                _item('10:00', '🛍️', 'Last-minute souvenirs', f'Local crafts near {primary}.'),
                _item('15:00', '✈️', f'Return to {origin}', 'Confirm transport; buffer time for mountain roads.'),
                _item('20:00', '🏠', 'Trip complete', 'Save plan in Create Trip for Trip Overview.'),
            ])
        else:
            highlight = highlights[(i - 1) % len(highlights)]
            if 'lake' in highlight.lower():
                theme = 'Nature & lakes'
            elif 'bazaar' in highlight.lower():
                theme = 'Culture & markets'
            else:
                theme = 'Sightseeing'
            items.extend([
                _item('08:00', '☕', 'Breakfast at hotel', guide['food']),
                _item('09:30', '📍', highlight, guide['tip']),
                _item('14:00', '🏛️', 'Afternoon exploration', 'Flexible if weather changes.'),
                _item('17:30', '🌅', 'Sunset viewpoint or old town stroll', 'Ask hotel for safest evening route.'),
                _item('19:30', '🍽️', 'Dinner — local speciality', guide['food']),
            ])

        itinerary.append({
            'day': f'Day {day_num}',
            'dateLabel': None,
            'theme': theme,
            'location': primary,
            'items': items,
        })

    return itinerary


def format_itinerary_message(days: int, destination: str, origin: str, itinerary: list) -> str:
    lines = [
        f"**{days}-Day Itinerary — {destination}**",
        f"From: {origin} | Style: {match_guide(destination).get('type', 'Trip')}",
        '',
        'Save this plan via **Create Trip** in the app for Trip Overview & budget sync.',
        '',
    ]
    for block in itinerary:
        lines.append(f"--- {block['day']}: {block['theme']} ({block['location']}) ---")
        for it in block.get('items', []):
            detail = f" — {it['detail']}" if it.get('detail') else ''
            lines.append(f"  {it.get('time', '')} {it.get('icon', '')} {it.get('title', '')}{detail}")
        lines.append('')
    lines.append('Tip: Ask for budget estimate, hotels, or weather for this trip!')
    return '\n'.join(lines)


def handle_itinerary_chat(message: str, context: list = None) -> dict | None:
    parsed = parse_itinerary_request(message, context)
    if parsed.get('action') is None:
        return None

    if parsed['action'] == 'ask_days':
        dest = parsed['destination']
        return {
            'message': (
                f"I can build a day-by-day plan for **{dest}**!\n\n"
                "How many days is your trip? Examples:\n"
                f"• `3 day itinerary {dest}`\n"
                f"• `5 days in {dest}`\n"
                f"• `Generate 7 day plan for {dest}`"
            ),
            'source': 'itinerary_prompt',
            'itinerary': None,
            'needsDays': True,
            'destination': dest,
        }

    if parsed['action'] == 'ask_destination':
        days = parsed.get('days') or 3
        return {
            'message': (
                f"I'll plan a **{days}-day itinerary** for you!\n\n"
                "Which destination? Examples:\n"
                "• `5 day itinerary Hunza`\n"
                "• `3 days in Lahore`\n"
                "• `7 day Dubai trip plan`"
            ),
            'source': 'itinerary_prompt',
            'itinerary': None,
            'needsDestination': True,
            'days': days,
        }

    days = parsed['days']
    dest = parsed['destination']
    origin = parsed.get('origin', 'Islamabad')
    plan = build_itinerary(days, dest, origin)
    text = format_itinerary_message(days, dest, origin, plan)

    return {
        'message': text,
        'source': 'itinerary',
        'confidence': 1.0,
        'itinerary': plan,
        'itineraryMeta': {
            'days': days,
            'destination': dest,
            'origin': origin,
        },
    }
