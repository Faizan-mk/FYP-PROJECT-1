from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from chatbot import chatbot_response
from knowledge_engine import get_stats
from llm_engine import is_llm_available, get_active_provider

app = Flask(__name__)
CORS(app)

# Warm up FAQ index on startup
_stats = None


def _warmup():
    global _stats
    try:
        _stats = get_stats()
        print(f"[OK] Travel knowledge loaded: {_stats['faq_count']} Q&A pairs")
    except Exception as e:
        print(f"Building knowledge base on first run: {e}")
        from faq_builder import load_or_build
        load_or_build()
        _stats = get_stats()
        print(f"[OK] Ready: {_stats['faq_count']} Q&A pairs")


@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json() or {}
        message = (data.get('message') or '').strip()
        context = data.get('context') or []

        if not message:
            return jsonify({'error': 'No message provided', 'status': 'error'}), 400

        result = chatbot_response(message, context)

        payload = {
            'message': result['message'],
            'status': 'success',
            'source': result.get('source', 'unknown'),
            'confidence': result.get('confidence', 0),
            'role': 'travel_guide',
        }
        if result.get('itinerary'):
            payload['itinerary'] = result['itinerary']
        if result.get('itineraryMeta'):
            payload['itineraryMeta'] = result['itineraryMeta']
        return jsonify(payload)
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'error': str(e), 'status': 'error'}), 500


@app.route('/api/health', methods=['GET'])
def health():
    global _stats
    if _stats is None:
        _warmup()
    return jsonify({
        'status': 'healthy',
        'message': 'AI Travel Guide API is running',
        'faq_count': _stats.get('faq_count', 0) if _stats else 0,
        'llm_enabled': is_llm_available(),
        'llm_provider': get_active_provider(),
        'free_web_ai': os.environ.get('ENABLE_FREE_WEB_AI', '1') not in ('0', 'false', 'no'),
        'version': '4.2',
    })


@app.route('/api/stats', methods=['GET'])
def stats():
    s = get_stats()
    return jsonify({'status': 'ok', **s})


if __name__ == '__main__':
    _warmup()
    port = int(os.environ.get('CHATBOT_PORT', 5001))
    if is_llm_available():
        llm_status = f'ON ({get_active_provider() or "ai"})'
    else:
        llm_status = 'Free web AI ON (add GEMINI/GROQ/OPENAI key for ChatGPT-quality)'
    print(f"Starting AI Travel Guide on port {port}... LLM: {llm_status}")
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
