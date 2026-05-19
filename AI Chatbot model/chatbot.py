import json
import pickle
import random
import re
import os
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model

from knowledge_engine import get_best_answer, get_stats
from itinerary_generator import handle_itinerary_chat
from llm_engine import generate_chat_reply, is_llm_available
from natural_reply import naturalize_answer
from free_ai import generate_free_reply, _is_travel as is_travel_query

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)

lemmatizer = WordNetLemmatizer()

_model = None
_intents = None
_words = None
_classes = None


def _load_neural():
    global _model, _intents, _words, _classes
    if _model is not None:
        return
    _model = load_model(os.path.join(BASE_DIR, 'chatbot_model.h5'))
    with open(os.path.join(BASE_DIR, 'intents.json'), 'r', encoding='utf-8') as f:
        _intents = json.load(f)
    with open(os.path.join(BASE_DIR, 'words.pkl'), 'rb') as f:
        _words = pickle.load(f)
    with open(os.path.join(BASE_DIR, 'classes.pkl'), 'rb') as f:
        _classes = pickle.load(f)


def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    return [lemmatizer.lemmatize(word.lower()) for word in sentence_words]


def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(_words)
    for w in sentence_words:
        for i, word in enumerate(_words):
            if word == w:
                bag[i] = 1
    return np.array(bag)


def predict_class(sentence, threshold=0.25):
    bow = bag_of_words(sentence)
    res = _model.predict(np.array([bow]), verbose=0)[0]
    results = [[i, r] for i, r in enumerate(res) if r > threshold]
    results.sort(key=lambda x: x[1], reverse=True)
    return [{'intent': _classes[r[0]], 'probability': float(r[1])} for r in results]


def get_neural_response(intents_list):
    if not intents_list:
        return None
    tag = intents_list[0]['intent']
    for intent in _intents['intents']:
        if intent['tag'] == tag:
            return random.choice(intent['responses'])
    return None


_FOLLOWUP_START = re.compile(
    r'^(yes|no|ok|thanks|thank you|more|please|sure|and\b|also\b|'
    r'what about|how about|tell me more|cheaper|better|same\b|'
    r'there\b|this\b|that\b|it\b)\b',
    re.I,
)
_STANDALONE_TOPIC = re.compile(
    r'\b(weather|hotel|flight|budget|itinerary|food|transport|visa|'
    r'fly|stay|accommodation|forecast|cost|price|things to do|places to visit)\b',
    re.I,
)


def _expand_with_context(message: str, context: list | None) -> str:
    """Only merge prior user text for real follow-ups — not new quick-pick topics."""
    if not context or not message:
        return message

    msg = message.strip()
    words = msg.split()

    # Standalone question (typical after clicking another quick suggestion)
    if _STANDALONE_TOPIC.search(msg) and len(words) >= 2:
        return msg
    if len(words) >= 3 or len(words) > 6:
        return msg
    if '?' in msg and len(words) >= 2:
        return msg
    if not _FOLLOWUP_START.search(msg):
        return msg

    for prev in reversed(context[-4:]):
        if prev.get('role') == 'user' and prev.get('text'):
            prev_text = prev['text'].strip()
            if len(prev_text.split()) > 2:
                return f"{prev_text} {msg}"
    return msg


def _travel_guide_footer(message: str) -> str:
    """Suggest app features based on query keywords."""
    m = message.lower()
    tips = []
    if any(w in m for w in ('hotel', 'stay', 'accommodation', 'resort')):
        tips.append('Browse **Hotels** in the app for live listings.')
    if any(w in m for w in ('flight', 'fly', 'airline', 'airport')):
        tips.append('Search **Flights** for routes and fares.')
    if any(w in m for w in ('weather', 'rain', 'temperature', 'forecast')):
        tips.append('Check **Weather** for real-time forecasts.')
    if any(w in m for w in ('budget', 'cost', 'price', 'expensive', 'cheap')):
        tips.append('Use **Budget Planner** for a custom trip estimate.')
    if any(w in m for w in ('bus', 'train', 'transport', 'daewoo', 'uber')):
        tips.append('See **Transport** for routes and bookings.')
    if any(w in m for w in ('safe', 'emergency', 'police')):
        tips.append('Open **Safety & Emergency** for contacts.')
    if any(w in m for w in ('itinerary', 'day plan', 'schedule', 'day by day')):
        tips.append('Ask e.g. **5 day itinerary Hunza** to generate a full day-by-day plan.')
    if tips:
        return '\n\nTip: ' + ' '.join(tips[:2])
    return ''


def chatbot_response(message: str, context: list = None) -> dict:
    """
    Hybrid travel guide: FAQ retrieval (20k+) → neural intents → helpful fallback.
    Returns dict with message, source, confidence.
    """
    message = (message or '').strip()
    if not message:
        return {
            'message': "Ask me anything — travel, general questions, or trip planning. e.g. 'Best hotels in Hunza?' or 'What is photosynthesis?'",
            'source': 'system',
            'confidence': 1.0,
        }

    expanded = _expand_with_context(message, context)
    faq_query = message
    neural_query = expanded if expanded != message else message

    # Tier 0: Structured day-by-day itinerary (keeps trip cards in UI)
    itinerary_result = handle_itinerary_chat(message, context)
    if itinerary_result:
        return {
            'message': itinerary_result['message'],
            'source': itinerary_result.get('source', 'itinerary'),
            'confidence': itinerary_result.get('confidence', 1.0),
            'itinerary': itinerary_result.get('itinerary'),
            'itineraryMeta': itinerary_result.get('itineraryMeta'),
        }

    # Tier 1: ChatGPT / Gemini / Groq — when API key is set
    llm_result = generate_chat_reply(message, context)
    if llm_result:
        return llm_result

    # Tier 1b: Free web AI (no key) — general / any question
    if os.environ.get('ENABLE_FREE_WEB_AI', '1').lower() not in ('0', 'false', 'no'):
        if not is_travel_query(message):
            free = generate_free_reply(message)
            if free:
                return free

    # Tier 2: FAQ knowledge base — travel questions
    faq_answer, confidence, source = get_best_answer(faq_query)
    if faq_answer and source == 'faq':
        text = naturalize_answer(message, faq_answer)
        return {'message': text, 'source': 'faq_natural', 'confidence': round(confidence, 3)}

    # Tier 3: Neural intent model
    _load_neural()
    ints = predict_class(neural_query)
    neural = get_neural_response(ints)
    if neural:
        if faq_answer and source == 'faq_low':
            text = naturalize_answer(message, faq_answer)
        else:
            text = neural
        return {
            'message': text,
            'source': 'neural' if not faq_answer else 'faq+neural',
            'confidence': round(confidence or (ints[0]['probability'] if ints else 0.5), 3),
        }

    # Tier 4: Lower-confidence FAQ still useful
    if faq_answer:
        return {
            'message': naturalize_answer(message, faq_answer),
            'source': 'faq_low',
            'confidence': round(confidence, 3),
        }

    # Tier 4b: Free web for anything FAQ/neural missed
    if os.environ.get('ENABLE_FREE_WEB_AI', '1').lower() not in ('0', 'false', 'no'):
        free = generate_free_reply(message)
        if free:
            return free

    # Tier 5: Smart fallback
    llm_hint = ''
    if not is_llm_available():
        llm_hint = (
            '\n\n💡 **ChatGPT mode:** Add `OPENAI_API_KEY` in `AI Chatbot model/.env` '
            '(https://platform.openai.com/api-keys) — then restart `python app.py`. '
            'Free option: `GEMINI_API_KEY` from https://aistudio.google.com/apikey'
        )
    return {
        'message': (
            "I'm your AI Travel Guide with 20,000+ answers about Pakistan and international trips. "
            "Try asking:\n"
            "• Best hotels in Lahore or Hunza\n"
            "• Weather in Skardu\n"
            "• Dubai trip budget\n"
            "• Flights to Istanbul\n"
            "• Things to do in Swat"
        ) + _travel_guide_footer(message) + llm_hint,
        'source': 'fallback',
        'confidence': 0.0,
    }


def chatbot_response_text(message: str, context: list = None) -> str:
    return chatbot_response(message, context)['message']


if __name__ == '__main__':
    stats = get_stats()
    print(f"Travel Guide ready — {stats['faq_count']} FAQ entries")
    print("Type 'quit' to exit.")
    while True:
        msg = input("You: ")
        if msg.lower() == 'quit':
            break
        out = chatbot_response(msg)
        print(f"Bot [{out['source']}]: {out['message'][:500]}...")
