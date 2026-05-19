import { useCallback, useEffect, useRef, useState } from 'react'
import {
    configureSpeechRecognition,
    getSpeechRecognitionCtor,
    isSpeechRecognitionSupported,
    releaseSpeechRecognition,
    shouldIgnoreSpeechError,
} from '../utils/speechRecognition'

/**
 * Voice search for traveler pages: live transcript in search bar + cancel/confirm modal.
 * @param {{ searchQuery: string, setSearchQuery: (value: string) => void, focusRef?: React.RefObject<HTMLElement> }} options
 */
export function useVoiceSearch({ searchQuery, setSearchQuery, focusRef }) {
    const [isListening, setIsListening] = useState(false)
    const [voiceText, setVoiceText] = useState('')
    const [voiceSupported, setVoiceSupported] = useState(false)

    const recognitionRef = useRef(null)
    const queryBeforeVoiceRef = useRef('')
    const searchQueryRef = useRef(searchQuery)
    const transcriptRef = useRef('')
    const sessionActiveRef = useRef(false)

    useEffect(() => {
        searchQueryRef.current = searchQuery
    }, [searchQuery])

    useEffect(() => {
        setVoiceSupported(isSpeechRecognitionSupported())
    }, [])

    const forceCleanup = useCallback(() => {
        sessionActiveRef.current = false
        transcriptRef.current = ''
        releaseSpeechRecognition(recognitionRef)
        setIsListening(false)
        setVoiceText('')
    }, [])

    const endSession = useCallback(
        ({ revertSearch = false } = {}) => {
            if (!sessionActiveRef.current) return

            const finalText = transcriptRef.current.trim()
            sessionActiveRef.current = false
            transcriptRef.current = ''
            releaseSpeechRecognition(recognitionRef)
            setIsListening(false)
            setVoiceText('')

            if (revertSearch) {
                setSearchQuery(queryBeforeVoiceRef.current)
            } else if (finalText) {
                setSearchQuery(finalText)
            }
        },
        [setSearchQuery]
    )

    const startListening = useCallback(async () => {
        const SR = getSpeechRecognitionCtor()
        if (!SR) return

        forceCleanup()

        queryBeforeVoiceRef.current = searchQueryRef.current
        const rec = new SR()
        recognitionRef.current = rec
        sessionActiveRef.current = true

        configureSpeechRecognition(rec, {
            onTranscript: (combined) => {
                if (!sessionActiveRef.current) return
                transcriptRef.current = combined
                setVoiceText(combined)
                setSearchQuery(combined)
            },
            onEnd: () => endSession({ revertSearch: false }),
            onError: (event) => {
                if (shouldIgnoreSpeechError(event)) return
                endSession({ revertSearch: true })
            },
        })

        setVoiceText('')
        try {
            rec.start()
            setIsListening(true)
        } catch {
            alert('Could not start voice search. Allow microphone access and try again.')
            endSession({ revertSearch: true })
        }
    }, [forceCleanup, endSession, setSearchQuery])

    const cancelListening = useCallback(() => {
        endSession({ revertSearch: true })
    }, [endSession])

    const confirmVoice = useCallback(() => {
        const finalText = (transcriptRef.current || voiceText).trim()
        if (finalText) setSearchQuery(finalText)
        endSession({ revertSearch: false })
        if (focusRef?.current) {
            setTimeout(() => focusRef.current?.focus(), 150)
        }
    }, [voiceText, setSearchQuery, endSession, focusRef])

    const toggleListening = useCallback(() => {
        if (isListening) cancelListening()
        else startListening()
    }, [isListening, cancelListening, startListening])

    useEffect(() => () => forceCleanup(), [forceCleanup])

    const inputValue = isListening && voiceText !== '' ? voiceText : searchQuery

    return {
        isListening,
        voiceText,
        voiceSupported,
        inputValue,
        startListening,
        cancelListening,
        confirmVoice,
        toggleListening,
    }
}
