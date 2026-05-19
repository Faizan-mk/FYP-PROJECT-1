"""
ChatGPT / Gemini / Groq — answers any question like ChatGPT.
Set OPENAI_API_KEY (ChatGPT) in .env — preferred when present.
"""
import os
import re
from pathlib import Path

from dotenv import load_dotenv

_BASE = Path(__file__).resolve().parent
load_dotenv(_BASE / '.env')
load_dotenv(_BASE.parent / 'Backend' / '.env')

SYSTEM_PROMPT = """You are a smart AI assistant inside a travel app — respond exactly like ChatGPT.

Core rules:
- Answer ANY question the user asks: travel, general knowledge, homework help, advice, coding, etc.
- Write naturally in clear paragraphs; use bullet points when listing items.
- Match the user's language (English, Urdu, or Roman Urdu).
- For travel/trip questions: give practical tips (PKR budgets for Pakistanis, seasons, safety, hotels, flights).
- For non-travel questions: answer directly — do not force travel advice unless they ask.
- If "Reference facts" are provided below, use them for travel topics but you may add your own knowledge.
- Be helpful and accurate; if unsure, say so honestly.
- Keep answers focused (roughly 80–250 words) unless they ask for a detailed guide or day-by-day plan."""

_TRAVEL_HINT = re.compile(
    r'\b(travel|trip|tour|visit|hotel|flight|fly|budget|weather|visa|itinerary|'
    r'pakistan|hunza|skardu|lahore|karachi|islamabad|dubai|istanbul|transport|'
    r'vacation|holiday|destination|resort|backpack)\b',
    re.I,
)


def is_llm_available() -> bool:
    return bool(
        os.environ.get('OPENAI_API_KEY', '').strip()
        or os.environ.get('GEMINI_API_KEY', '').strip()
        or os.environ.get('GROQ_API_KEY', '').strip()
    )


def get_active_provider() -> str | None:
    for name in _ordered_providers():
        return name
    return None


def _ordered_providers() -> list[str]:
    pref = os.environ.get('LLM_PROVIDER', 'openai').strip().lower()
    keys = {
        'openai': bool(os.environ.get('OPENAI_API_KEY', '').strip()),
        'gemini': bool(os.environ.get('GEMINI_API_KEY', '').strip()),
        'groq': bool(os.environ.get('GROQ_API_KEY', '').strip()),
    }
    if pref in ('chatgpt', 'gpt', 'openai'):
        order = ['openai', 'gemini', 'groq']
    elif pref == 'gemini':
        order = ['gemini', 'openai', 'groq']
    elif pref == 'groq':
        order = ['groq', 'openai', 'gemini']
    else:
        order = ['openai', 'gemini', 'groq']
    return [p for p in order if keys.get(p)]


def _is_travel_related(message: str) -> bool:
    return bool(_TRAVEL_HINT.search(message or ''))


def get_rag_context(query: str, max_snippets: int = 3) -> str:
    if not _is_travel_related(query):
        return ''
    try:
        from knowledge_engine import search_faq

        results = search_faq(query, top_k=max_snippets)
        if not results:
            return ''
        return '\n'.join(f'- {r["answer"]}' for r in results)
    except Exception as exc:
        print(f'[llm] RAG skip: {exc}')
        return ''


def _format_user_prompt(message: str, rag: str) -> str:
    if rag:
        return f'Reference facts (travel database):\n{rag}\n\nUser:\n{message}'
    return message


def _history_for_openai(context: list | None) -> list:
    out = []
    for msg in (context or [])[-10:]:
        text = (msg.get('text') or '').strip()
        if not text:
            continue
        role = 'user' if msg.get('role') == 'user' else 'assistant'
        out.append({'role': role, 'content': text})
    return out


def _generate_openai(message: str, context: list | None, rag: str) -> str:
    from openai import OpenAI

    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'].strip())
    model = os.environ.get('OPENAI_MODEL', 'gpt-4o-mini').strip()
    messages = [{'role': 'system', 'content': SYSTEM_PROMPT}]
    messages.extend(_history_for_openai(context))
    messages.append({'role': 'user', 'content': _format_user_prompt(message, rag)})

    resp = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.7,
        max_tokens=1500,
    )
    return (resp.choices[0].message.content or '').strip()


def _generate_gemini(message: str, context: list | None, rag: str) -> str:
    import google.generativeai as genai

    genai.configure(api_key=os.environ['GEMINI_API_KEY'].strip())
    model_name = os.environ.get('GEMINI_MODEL', 'gemini-1.5-flash').strip()
    model = genai.GenerativeModel(model_name=model_name, system_instruction=SYSTEM_PROMPT)

    history = []
    for msg in (context or [])[-10:]:
        text = (msg.get('text') or '').strip()
        if not text:
            continue
        role = 'user' if msg.get('role') == 'user' else 'model'
        history.append({'role': role, 'parts': [text]})

    chat = model.start_chat(history=history)
    response = chat.send_message(_format_user_prompt(message, rag))
    return (response.text or '').strip()


def _generate_groq(message: str, context: list | None, rag: str) -> str:
    from openai import OpenAI

    client = OpenAI(
        api_key=os.environ['GROQ_API_KEY'].strip(),
        base_url='https://api.groq.com/openai/v1',
    )
    model = os.environ.get('GROQ_MODEL', 'llama-3.3-70b-versatile').strip()
    messages = [{'role': 'system', 'content': SYSTEM_PROMPT}]
    messages.extend(_history_for_openai(context))
    messages.append({'role': 'user', 'content': _format_user_prompt(message, rag)})

    resp = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.7,
        max_tokens=1500,
    )
    return (resp.choices[0].message.content or '').strip()


_GENERATORS = {
    'openai': _generate_openai,
    'gemini': _generate_gemini,
    'groq': _generate_groq,
}


def generate_chat_reply(message: str, context: list | None = None, rag_context: str | None = None) -> dict | None:
    if not is_llm_available():
        return None

    rag = rag_context if rag_context is not None else get_rag_context(message)

    for name in _ordered_providers():
        fn = _GENERATORS.get(name)
        if not fn:
            continue
        try:
            text = fn(message, context, rag)
            if text:
                label = 'chatgpt' if name == 'openai' else name
                return {'message': text, 'source': label, 'confidence': 0.98}
        except Exception as exc:
            print(f'[llm] {name} failed: {exc}')

    return None
