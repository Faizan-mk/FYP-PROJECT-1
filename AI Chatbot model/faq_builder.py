"""
Build 20,000+ travel Q&A pairs from structured templates.
Run: python faq_builder.py
"""
import json
import os
import pickle
from travel_knowledge import (
    PAKISTAN_CITIES,
    INTERNATIONAL_CITIES,
    CITY_DETAILS,
    TOPIC_TEMPLATES,
    GENERIC_ANSWERS,
    EXTRA_QUESTION_SUFFIXES,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAQ_JSON = os.path.join(BASE_DIR, 'faq_database.json')
FAQ_INDEX = os.path.join(BASE_DIR, 'faq_index.pkl')


def _slug(city: str) -> str:
    return city.lower().strip().replace(' ', '_').replace('-', '_')


def _detail(city: str, field: str, fallback: str) -> str:
    key = _slug(city)
    if key in CITY_DETAILS and field in CITY_DETAILS[key]:
        return CITY_DETAILS[key][field]
    return fallback.format(city=city)


def _answer_for(topic: str, city: str, is_pakistan: bool) -> str:
    key = _slug(city)
    region = 'Pakistan' if is_pakistan else 'international'
    prefix = f"**{city}** ({region}) - "

    if topic == 'hotels':
        hotels = _detail(city, 'hotels', GENERIC_ANSWERS['hotels'])
        return prefix + f"**Hotels:** {hotels}. Book via the app's Hotels section."
    if topic == 'flights':
        if is_pakistan:
            return prefix + (
                f"**Flights:** Domestic routes to {city} via PIA, Airblue, Serene, AirSial. "
                "Islamabad–Skardu/Gilgit are scenic but weather-sensitive. Book 3–4 weeks ahead; Tue–Thu often cheaper."
            )
        return prefix + GENERIC_ANSWERS['flights'].format(city=city)
    if topic == 'weather':
        w = _detail(city, 'weather', GENERIC_ANSWERS['weather'])
        return prefix + f"**Weather:** {w}. Live forecast available in the app Weather section."
    if topic == 'budget':
        b = _detail(city, 'budget_3day', _detail(city, 'budget_5day', GENERIC_ANSWERS['budget']))
        return prefix + f"**Budget:** {b}. Use Budget Planner in the app for custom totals."
    if topic == 'food':
        f = _detail(city, 'food', GENERIC_ANSWERS['food'])
        return prefix + f"**Food:** {f}"
    if topic == 'activities':
        a = _detail(city, 'activities', GENERIC_ANSWERS['activities'])
        return prefix + f"**Things to do:** {a}"
    if topic == 'transport':
        t = _detail(city, 'transport', GENERIC_ANSWERS['transport'])
        return prefix + f"**Transport:** {t}"
    if topic == 'safety':
        extra = "Northern areas: hire licensed drivers; keep CNIC/passport copies." if is_pakistan else ""
        return prefix + GENERIC_ANSWERS['safety'].format(city=city) + (" " + extra if extra else "")
    if topic == 'visa':
        if is_pakistan:
            return prefix + "Domestic travel—no visa needed. Carry CNIC; foreigners need valid Pakistan visa."
        return prefix + GENERIC_ANSWERS['visa'].format(city=city)
    if topic == 'packing':
        return prefix + GENERIC_ANSWERS['packing'].format(city=city)
    return prefix + GENERIC_ANSWERS['general'].format(city=city)


def build_faq_pairs() -> list:
    pairs = []
    seen = set()

    def add(q: str, a: str, meta: dict):
        qn = ' '.join(q.lower().split())
        if qn in seen:
            return
        seen.add(qn)
        pairs.append({'question': qn, 'answer': a, **meta})

    def add_city_set(cities, is_pakistan):
        for city in cities:
            for topic, templates in TOPIC_TEMPLATES.items():
                answer = _answer_for(topic, city, is_pakistan)
                region = 'pakistan' if is_pakistan else 'international'
                for tpl in templates:
                    base_q = tpl.format(city=city)
                    add(base_q, answer, {'topic': topic, 'city': city, 'region': region})
                # Variants for high-demand topics only
                if topic in ('hotels', 'weather', 'budget', 'flights', 'activities'):
                    for tpl in templates[:6]:
                        base_q = tpl.format(city=city)
                        for suffix in EXTRA_QUESTION_SUFFIXES:
                            add(f"{base_q} {suffix}", answer, {'topic': topic, 'city': city, 'region': region})

    add_city_set(PAKISTAN_CITIES, True)
    add_city_set(INTERNATIONAL_CITIES, False)

    # Global travel-guide questions (no city)
    global_qa = [
        ("assalam o alaikum", "Wa Alaikum Assalam! I'm your AI Travel Guide for Pakistan and worldwide trips. Ask about hotels, flights, weather, budget, food, or any destination!"),
        ("hello", "Hello! I'm your real-time travel guide. Where would you like to go—Hunza, Dubai, Istanbul, or somewhere else?"),
        ("hi travel guide", "Hi! I cover 20,000+ travel questions—Pakistan northern areas, Gulf, Turkey, Asia, and more. What are you planning?"),
        ("best places in pakistan", "Top Pakistan picks: Hunza (Apr–Oct), Skardu & Deosai, Swat, Naran-Kaghan, Lahore (culture & food), Islamabad (nature), Karachi (coast). Each suits different budgets—ask me about any city!"),
        ("northern areas pakistan", "Northern Pakistan: Hunza, Skardu, Fairy Meadows, Naran, Swat, Chitral/Kalash. Best May–September; book hotels early; fly Islamabad–Gilgit/Skardu or drive KKH. Mountain weather changes fast—pack layers."),
        ("how to plan a trip", "1) Pick destination & dates 2) Check weather 3) Book flights/transport 4) Hotels 5) Daily itinerary 6) Budget buffer 15%. Use this app's Flights, Hotels, Itinerary, and Budget Planner tools—I guide each step!"),
        ("travel insurance pakistan", "Get travel insurance covering medical, trip cancellation, and adventure activities if trekking. Required for Schengen visas. Compare plans before international trips."),
        ("sim card pakistan tourist", "Buy Jazz, Zong, or Ufone SIM at airport/city franchise with passport copy. Data packages PKR 500–1500/month. Works well in cities; spotty in remote mountains."),
        ("currency exchange pakistan", "USD/EUR at exchange companies (often better than banks). ATMs in cities; carry cash for northern areas. Haggle politely at markets."),
        ("emergency numbers pakistan", "Police 15, Rescue 1122, Ambulance 115, Fire 16. Save local hotel and driver contacts. Share live location with family when trekking."),
    ]
    for q, a in global_qa:
        add(q, a, {'topic': 'general', 'city': '', 'region': 'global'})

    return pairs


def save_faq_database(pairs: list):
    with open(FAQ_JSON, 'w', encoding='utf-8') as f:
        json.dump({'version': 2, 'count': len(pairs), 'pairs': pairs}, f, ensure_ascii=False)
    print(f'Saved {len(pairs)} Q&A pairs to {FAQ_JSON}')


def build_tfidf_index(pairs: list):
    from sklearn.feature_extraction.text import TfidfVectorizer
    import numpy as np

    questions = [p['question'] for p in pairs]
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=50000,
        sublinear_tf=True,
        strip_accents='unicode',
    )
    matrix = vectorizer.fit_transform(questions)
    index = {
        'vectorizer': vectorizer,
        'matrix': matrix,
        'pairs': pairs,
    }
    with open(FAQ_INDEX, 'wb') as f:
        pickle.dump(index, f)
    print(f'Saved TF-IDF index ({matrix.shape[0]} x {matrix.shape[1]}) to {FAQ_INDEX}')


def load_or_build(force: bool = False) -> dict:
    if not force and os.path.isfile(FAQ_INDEX) and os.path.isfile(FAQ_JSON):
        with open(FAQ_INDEX, 'rb') as f:
            return pickle.load(f)

    print('Building FAQ knowledge base (20k+ Q&A)...')
    pairs = build_faq_pairs()
    print(f'Generated {len(pairs)} unique Q&A pairs')
    if len(pairs) < 20000:
        print(f'Warning: expected 20k+, got {len(pairs)}')

    save_faq_database(pairs)
    build_tfidf_index(pairs)
    with open(FAQ_INDEX, 'rb') as f:
        return pickle.load(f)


if __name__ == '__main__':
    load_or_build(force=True)
