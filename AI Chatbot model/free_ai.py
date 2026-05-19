"""
Free answers for any question — no API key (DuckDuckGo + Wikipedia).
Works offline from paid OpenAI/Gemini when those keys are not set.
"""
import re
import urllib.parse
import urllib.request
import json

_USER_AGENT = 'TravelGuideBot/1.0 (FYP; educational)'


def _get_json(url: str, timeout: int = 10) -> dict | list | None:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': _USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode('utf-8', errors='replace'))
    except Exception as exc:
        print(f'[free_ai] fetch failed: {exc}')
        return None


def _duckduckgo(query: str) -> str:
    q = urllib.parse.quote(query)
    url = f'https://api.duckduckgo.com/?q={q}&format=json&no_html=1&skip_disambig=1'
    data = _get_json(url)
    if not isinstance(data, dict):
        return ''
    abstract = (data.get('AbstractText') or '').strip()
    if abstract:
        src = data.get('AbstractSource') or 'DuckDuckGo'
        return abstract if len(abstract) > 40 else ''
    related = data.get('RelatedTopics') or []
    for item in related:
        if isinstance(item, dict) and item.get('Text'):
            text = item['Text'].strip()
            if len(text) > 50:
                return text
    return ''


def _wikipedia(query: str) -> str:
    q = urllib.parse.quote(query)
    search_url = (
        f'https://en.wikipedia.org/w/api.php?action=opensearch'
        f'&search={q}&limit=1&namespace=0&format=json'
    )
    search = _get_json(search_url)
    if not search or len(search) < 2 or not search[1]:
        return ''
    title = search[1][0]
    title_q = urllib.parse.quote(title.replace(' ', '_'))
    summary_url = f'https://en.wikipedia.org/api/rest_v1/page/summary/{title_q}'
    page = _get_json(summary_url)
    if not isinstance(page, dict):
        return ''
    extract = (page.get('extract') or '').strip()
    if extract and len(extract) > 30:
        return extract
    return ''


def _is_travel(query: str) -> bool:
    return bool(
        re.search(
            r'\b(travel|trip|hotel|flight|visit|tour|budget|weather|visa|'
            r'pakistan|hunza|dubai|lahore|itinerary)\b',
            query,
            re.I,
        )
    )


def _format_answer(query: str, body: str, source_name: str) -> str:
    intro = "Here's what I found:"
    if _is_travel(query):
        intro = "Here's a quick travel-related answer:"
    paragraphs = body.strip()
    if len(paragraphs) > 600:
        paragraphs = paragraphs[:597].rsplit(' ', 1)[0] + '...'
    return (
        f"{intro}\n\n{paragraphs}\n\n"
        f"_Source: {source_name} (live web). For trip bookings use Hotels / Flights in the app._"
    )


def _simple_math(query: str) -> str | None:
    m = re.match(
        r'^\s*(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)\s*=?\s*$',
        query.replace('x', '*').replace('×', '*'),
    )
    if not m:
        return None
    a, op, b = float(m.group(1)), m.group(2), float(m.group(3))
    if op == '+':
        r = a + b
    elif op == '-':
        r = a - b
    elif op == '*':
        r = a * b
    elif op == '/' and b != 0:
        r = a / b
    else:
        return None
    out = int(r) if r == int(r) else round(r, 4)
    return f'{m.group(1)} {op} {m.group(3)} = **{out}**'


def generate_free_reply(message: str) -> dict | None:
    """Answer any general question using free web sources."""
    query = (message or '').strip()
    if not query or len(query) < 2:
        return None

    math_ans = _simple_math(query)
    if math_ans:
        return {
            'message': math_ans,
            'source': 'free_web',
            'confidence': 1.0,
        }

    body = _duckduckgo(query)
    source = 'DuckDuckGo'
    if not body or len(body) < 40:
        body = _wikipedia(query)
        source = 'Wikipedia'
    if not body:
        return None

    return {
        'message': _format_answer(query, body, source),
        'source': 'free_web',
        'confidence': 0.8,
    }
