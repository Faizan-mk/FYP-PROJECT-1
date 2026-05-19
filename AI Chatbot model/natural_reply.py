"""
ChatGPT-style formatting without an API key — rewrites FAQ answers into natural prose.
"""
import re

_CITY_RE = re.compile(r'\*\*([^*]+)\*\*\s*\(([^)]+)\)')
_TOPIC_RE = re.compile(r'\*\*([^*]+)\*\*:\s*')


def _detect_intent(query: str) -> str:
    q = query.lower()
    if any(w in q for w in ('hotel', 'stay', 'accommodation', 'resort')):
        return 'hotels'
    if any(w in q for w in ('budget', 'cost', 'price', 'expensive', 'cheap')):
        return 'budget'
    if any(w in q for w in ('weather', 'rain', 'temperature', 'forecast')):
        return 'weather'
    if any(w in q for w in ('flight', 'fly', 'airline')):
        return 'flights'
    if any(w in q for w in ('food', 'eat', 'restaurant')):
        return 'food'
    if any(w in q for w in ('itinerary', 'day plan', 'days in')):
        return 'itinerary'
    if any(w in q for w in ('transport', 'bus', 'train')):
        return 'transport'
    return 'general'


def _opener(query: str, city: str, region: str) -> str:
    intent = _detect_intent(query)
    place = f'**{city}**' if city else 'your trip'
    openers = {
        'hotels': f"Here are good places to stay in {place} ({region}):" if city else 'Here are hotel tips for your trip:',
        'budget': f"Here's a practical budget guide for {place}:" if city else "Here's a rough budget guide:",
        'weather': f"Weather-wise, here's what to expect in {place}:" if city else "About the weather:",
        'flights': f"Flight options for {place}:" if city else 'About flights:',
        'food': f"Food you should try in {place}:" if city else 'Local food tips:',
        'transport': f"Getting around {place}:" if city else 'Transport tips:',
        'itinerary': f"Planning {place}:" if city else 'Trip planning tips:',
        'general': f"Here's what I know about {place}:" if city else "Here's my travel advice:",
    }
    return openers.get(intent, openers['general'])


def _strip_template(raw: str) -> tuple[str, str, str]:
    """Returns (city, region, body_text)."""
    city, region = '', ''
    m = _CITY_RE.search(raw)
    if m:
        city, region = m.group(1).strip(), m.group(2).strip()
    body = _CITY_RE.sub('', raw, count=1).strip()
    body = re.sub(r'^-\s*', '', body)
    body = _TOPIC_RE.sub('', body)
    body = body.replace('**', '')
    body = re.sub(r'\s+', ' ', body).strip()
    return city, region, body


def _bullet_body(body: str) -> str:
    if len(body) < 120:
        return body
    parts = re.split(r'\.\s+(?=[A-Z])', body)
    if len(parts) <= 1:
        return body
    lines = [f'- {p.strip().rstrip(".")}.' for p in parts[:5] if p.strip()]
    return '\n'.join(lines) if lines else body


def _closing(query: str) -> str:
    q = query.lower()
    tips = []
    if 'hotel' in q:
        tips.append('Open **Hotels** in the app to compare live prices.')
    if 'budget' in q:
        tips.append('Use **Budget Planner** for a custom PKR estimate.')
    if 'weather' in q:
        tips.append('Check **Weather** in the app for a live forecast.')
    if 'flight' in q:
        tips.append('Search **Flights** for routes and fares.')
    if not tips:
        tips.append('Ask a follow-up anytime — hotels, food, weather, or a day-by-day plan.')
    return tips[0]


def naturalize_answer(query: str, raw_answer: str) -> str:
    if not raw_answer or not raw_answer.strip():
        return raw_answer
    city, region, body = _strip_template(raw_answer)
    region = region or 'travel destination'
    opener = _opener(query, city, region)
    main = _bullet_body(body) if len(body) > 100 else body
    return f"{opener}\n\n{main}\n\n{closing}" if (closing := _closing(query)) else f"{opener}\n\n{main}"
