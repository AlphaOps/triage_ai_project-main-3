import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Premium speech recognition hook using the native Web Speech API.
 * Returns listening state, transcript, and controls.
 * 
 * Designed for medical-grade voice input — no gimmicks,
 * just reliable, clean transcription.
 */
const useSpeechRecognition = ({ onResult, continuous = false, lang = 'en-US' } = {}) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);
    const onResultRef = useRef(onResult);

    // Keep callback ref current
    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    // Initialize once
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }
        setIsSupported(true);

        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.interimResults = true;
        recognition.continuous = continuous;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            const currentTranscript = finalTranscript || interimTranscript;
            setTranscript(currentTranscript);

            if (finalTranscript && onResultRef.current) {
                onResultRef.current(finalTranscript.trim());
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            // Silently handle — premium UX means no jarring errors
            if (event.error !== 'aborted' && event.error !== 'no-speech') {
                console.warn('Speech recognition:', event.error);
            }
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.abort();
        };
    }, [lang, continuous]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current || isListening) return;
        setTranscript('');
        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch (e) {
            // Already started — ignore
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current || !isListening) return;
        recognitionRef.current.stop();
        setIsListening(false);
    }, [isListening]);

    const toggle = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    return {
        isListening,
        transcript,
        isSupported,
        startListening,
        stopListening,
        toggle,
    };
};

export default useSpeechRecognition;
