"""
Real-time FAQ retrieval — TF-IDF cosine similarity over 20k+ travel Q&A.
"""
import os
import re
import pickle

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAQ_INDEX = os.path.join(BASE_DIR, 'faq_index.pkl')

_index = None
SIMILARITY_THRESHOLD = 0.22
HIGH_CONFIDENCE = 0.38

_TOPIC_HINTS = {
    'budget': ('budget', 'cost', 'price', 'expensive', 'cheap', 'afford'),
    'hotels': ('hotel', 'stay', 'accommodation', 'resort', 'lodge'),
    'food': ('food', 'eat', 'restaurant', 'dish', 'biryani', 'cuisine'),
    'weather': ('weather', 'rain', 'temperature', 'forecast', 'climate'),
    'flights': ('flight', 'fly', 'airline', 'airport', 'pia'),
    'transport': ('transport', 'bus', 'train', 'daewoo', 'uber', 'careem'),
    'activities': ('things to do', 'activity', 'attraction', 'visit', 'sightseeing'),
    'itinerary': ('itinerary', 'day plan', 'schedule', 'days in'),
}

_ALL_CITIES = None


def _normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text


def _all_cities():
    global _ALL_CITIES
    if _ALL_CITIES is None:
        from travel_knowledge import PAKISTAN_CITIES, INTERNATIONAL_CITIES
        _ALL_CITIES = sorted(
            {c.lower() for c in PAKISTAN_CITIES + INTERNATIONAL_CITIES},
            key=len,
            reverse=True,
        )
    return _ALL_CITIES


def _cities_in_query(query: str) -> list:
    q = _normalize(query)
    return [c for c in _all_cities() if c in q]


def _topics_in_query(query: str) -> list:
    q = _normalize(query)
    return [t for t, hints in _TOPIC_HINTS.items() if any(h in q for h in hints)]


def _rank_result(result: dict, cities: list, topics: list) -> float:
    score = result['score']
    city = (result.get('city') or '').lower()
    topic = (result.get('topic') or '').lower()

    if cities:
        if city and city in cities:
            score += 0.2
        elif city and city not in cities:
            score -= 0.35
    if topics:
        if topic and topic in topics:
            score += 0.15
        elif topic and topics:
            score -= 0.1
    return score


def _ensure_index():
    global _index
    if _index is not None:
        return _index
    if os.path.isfile(FAQ_INDEX):
        with open(FAQ_INDEX, 'rb') as f:
            _index = pickle.load(f)
        return _index
    from faq_builder import load_or_build
    _index = load_or_build()
    return _index


def search_faq(query: str, top_k: int = 3):
    """Return list of {answer, score, question, meta}."""
    from sklearn.metrics.pairwise import cosine_similarity

    index = _ensure_index()
    vectorizer = index['vectorizer']
    matrix = index['matrix']
    pairs = index['pairs']

    q = _normalize(query)
    if not q:
        return []

    q_vec = vectorizer.transform([q])
    scores = cosine_similarity(q_vec, matrix).flatten()
    top_idx = scores.argsort()[-top_k:][::-1]

    results = []
    for i in top_idx:
        if scores[i] < SIMILARITY_THRESHOLD:
            continue
        p = pairs[i]
        results.append({
            'answer': p['answer'],
            'score': float(scores[i]),
            'question': p['question'],
            'topic': p.get('topic', ''),
            'city': p.get('city', ''),
        })
    return results


def get_best_answer(query: str) -> tuple:
    """
    Returns (answer_text, confidence, source).
    source: 'faq' | 'faq_low' | None
    """
    results = search_faq(query, top_k=8)
    if not results:
        return None, 0.0, None

    cities = _cities_in_query(query)
    topics = _topics_in_query(query)
    best = max(results, key=lambda r: _rank_result(r, cities, topics))
    score = best['score']

    if score >= HIGH_CONFIDENCE:
        return best['answer'], score, 'faq'
    if score >= SIMILARITY_THRESHOLD:
        return best['answer'], score, 'faq_low'
    return None, score, None


def get_stats():
    index = _ensure_index()
    return {
        'faq_count': len(index['pairs']),
        'indexed': True,
    }
