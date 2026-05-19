import {
    combineSpeechTranscripts,
    shouldIgnoreSpeechError,
    stripAutoSpeechPunctuation,
} from '../src/app/frontend/utils/speechRecognition.js'

function assert(condition, message) {
    if (!condition) throw new Error(message)
}

function mockResults(segments) {
    return segments.map(({ text, isFinal }) => ({
        0: { transcript: text },
        isFinal,
        length: 1,
    }))
}

// stripAutoSpeechPunctuation
assert(stripAutoSpeechPunctuation('Karachi.') === 'Karachi', 'strip single trailing dot')
assert(stripAutoSpeechPunctuation('Karachi...') === 'Karachi', 'strip multiple trailing dots')
assert(stripAutoSpeechPunctuation('Karachi') === 'Karachi', 'leave text without dot')

// combineSpeechTranscripts
const combined = combineSpeechTranscripts(mockResults([
    { text: 'show flights to ', isFinal: false },
    { text: 'Karachi.', isFinal: true },
]))
assert(combined === 'show flights to Karachi', `combine strips final dot, got "${combined}"`)

// shouldIgnoreSpeechError
assert(shouldIgnoreSpeechError({ error: 'aborted' }) === true, 'ignore aborted')
assert(shouldIgnoreSpeechError({ error: 'no-speech' }) === true, 'ignore no-speech')
assert(shouldIgnoreSpeechError({ error: 'not-allowed' }) === false, 'do not ignore not-allowed')

console.log('speechRecognition tests passed')
