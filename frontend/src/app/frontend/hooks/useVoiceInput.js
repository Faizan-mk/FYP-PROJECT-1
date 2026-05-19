import { useCallback, useEffect, useRef, useState } from 'react'
import {
    configureSpeechRecognition,
    getSpeechRecognitionCtor,
    shouldIgnoreSpeechError,
    stopActiveSpeechRecognition,
} from '../utils/speechRecognition'

/** Voice input for chat: appends transcript to existing text, toggle to stop. */
export function useVoiceInput({ text, setText }) {
    const [listening, setListening] = useState(false)
    const recRef = useRef(null)
    const textBeforeVoiceRef = useRef('')
    const textRef = useRef(text)
    const transcriptRef = useRef('')
    const sessionActiveRef = useRef(false)

    useEffect(() => {
        textRef.current = text
    }, [text])

    useEffect(() => {
        const SR = getSpeechRecognitionCtor()
        if (!SR) return

        const rec = new SR()
        configureSpeechRecognition(rec, {
            onTranscript: (utterance) => {
                if (!sessionActiveRef.current) return
                transcriptRef.current = utterance
                const base = textBeforeVoiceRef.current
                const next =
                    utterance === ''
                        ? base
                        : base
                          ? `${base.trimEnd()} ${utterance}`
                          : utterance
                setText(next)
            },
            onEnd: () => {
                sessionActiveRef.current = false
                setListening(false)
            },
            onError: (event) => {
                sessionActiveRef.current = false
                setListening(false)
                if (shouldIgnoreSpeechError(event)) return
                setText(textBeforeVoiceRef.current)
            },
        })
        recRef.current = rec
    }, [setText])

    const stopListening = useCallback(() => {
        sessionActiveRef.current = false
        stopActiveSpeechRecognition(recRef.current)
        setListening(false)
        setText(textBeforeVoiceRef.current)
        transcriptRef.current = ''
    }, [setText])

    const toggleVoice = useCallback(async () => {
        if (!recRef.current) {
            alert('Voice input not supported in this browser')
            return
        }
        if (listening) {
            stopListening()
            return
        }

        textBeforeVoiceRef.current = textRef.current
        transcriptRef.current = ''
        sessionActiveRef.current = true
        stopActiveSpeechRecognition(recRef.current)
        try {
            recRef.current.start()
            setListening(true)
        } catch {
            sessionActiveRef.current = false
            setListening(false)
            setText(textBeforeVoiceRef.current)
        }
    }, [listening, stopListening, setText])

    return { listening, toggleVoice }
}
