/**
 * Chrome / WebKit SpeechRecognition auto-appends sentence punctuation (usually ".")
 * to finalized segments. Strip it so search and chat inputs stay clean.
 * @param {string} text
 * @returns {string}
 */
export function stripAutoSpeechPunctuation(text) {
    return text.replace(/\.+$/, '').trimEnd()
}

/**
 * Full utterance text from a SpeechRecognition `results` list (order preserved;
 * avoids losing trailing interim when some segments are already final).
 * @param {SpeechRecognitionResultList} results
 * @returns {string}
 */
export function combineSpeechTranscripts(results) {
    let out = ''
    for (let i = 0; i < results.length; i++) {
        let segment = results[i][0].transcript
        if (results[i].isFinal) {
            segment = stripAutoSpeechPunctuation(segment)
        }
        out += segment
    }
    return stripAutoSpeechPunctuation(out.trim())
}

export function getSpeechRecognitionCtor() {
    if (typeof window === 'undefined') return null
    return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function isSpeechRecognitionSupported() {
    return Boolean(getSpeechRecognitionCtor())
}

/** Ignore expected errors after cancel/confirm (abort) or when user stays silent. */
export function shouldIgnoreSpeechError(event) {
    const code = event?.error
    return code === 'aborted' || code === 'no-speech'
}

/** Browsers pick the first supported locale (Urdu + English for PK users). */
export const DEFAULT_SPEECH_LANG = 'ur-PK,en-US,en-PK'

/** Ask for mic permission; returns stream — caller must stop tracks when done. */
export async function ensureMicrophoneAccess() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        return { ok: false, reason: 'unsupported', stream: null }
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        return { ok: true, stream }
    } catch (err) {
        return { ok: false, reason: err?.name || 'denied', stream: null }
    }
}

export function stopMicrophoneStream(stream) {
    stream?.getTracks?.().forEach((track) => track.stop())
}

/** Force-stop a recognition instance (abort preferred for cancel). */
export function stopActiveSpeechRecognition(rec) {
    if (!rec) return
    try {
        rec.abort()
    } catch {
        try {
            rec.stop()
        } catch {
            // ignore
        }
    }
}

/** Stop recognition and clear the ref so a fresh instance can be created. */
export function releaseSpeechRecognition(recognitionRef) {
    const rec = recognitionRef?.current
    if (recognitionRef) recognitionRef.current = null
    stopActiveSpeechRecognition(rec)
}

/**
 * @param {SpeechRecognition} rec
 * @param {{ onTranscript?: (text: string, event: SpeechRecognitionEvent) => void, onEnd?: () => void, onError?: (event: SpeechRecognitionErrorEvent) => void }} handlers
 */
export function configureSpeechRecognition(rec, handlers = {}) {
    const { onTranscript, onEnd, onError, lang = DEFAULT_SPEECH_LANG } = handlers
    rec.lang = lang
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.onresult = (event) => onTranscript?.(combineSpeechTranscripts(event.results), event)
    rec.onend = () => onEnd?.()
    rec.onerror = (event) => onError?.(event)
    return rec
}
