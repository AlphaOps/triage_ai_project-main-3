import React, { useState, useEffect, useRef } from 'react';
import './VoiceIntakeModal.css';

const STEPS = [
    { id: 'demographics', label: 'Demographics', prompt: "Please tell me your age and gender.", field: 'demographics' },
    { id: 'issues', label: 'Symptoms & Issues', prompt: "Please describe your current symptoms and any existing medical issues.", field: 'issues' },
    { id: 'vitals', label: 'Vitals', prompt: "Please state your blood pressure, temperature, and heart rate if known.", field: 'vitals' },
    { id: 'additional', label: 'Additional Info', prompt: "Do you have any other questions or details you'd like to share?", field: 'additional' },
    { id: 'complete', label: 'Assessment Complete', prompt: "Thank you. Your clinical assessment data has been recorded.", field: null }
];

const VoiceIntakeModal = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [assessment, setAssessment] = useState({
        age: '',
        gender: '',
        symptoms: '',
        issues: '',
        bp: '',
        temp: '',
        heart_rate: '',
        additional_info: ''
    });

    // Speech Recognition Ref
    const recognitionRef = useRef(null);

    // Initialize Web Speech API
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.maxAlternatives = 1;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal === true) {
                        finalTranscript += result[0].transcript;
                    }
                }

                if (finalTranscript.trim()) {
                    setTranscript(prev => {
                        const newText = prev + (prev ? " " : "") + finalTranscript;
                        return newText;
                    });
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    alert("Microphone access blocked. Please allow access to use Voice Mode.");
                    setIsListening(false);
                }
            };

            recognitionRef.current.onend = () => {
                if (isListening) {
                    setIsListening(false);
                }
            };
        } else {
            console.warn("Web Speech API not supported in this browser.");
        }
    }, [isListening]);

    // Reset on Open
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setTranscript('');
            setAssessment({
                age: '',
                gender: '',
                symptoms: '',
                issues: '',
                bp: '',
                temp: '',
                heart_rate: '',
                additional_info: ''
            });
            setIsListening(false);
        } else {
            if (recognitionRef.current) recognitionRef.current.stop();
        }
    }, [isOpen]);

    // Mic Toggle
    const toggleMic = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(true);
        try {
            recognitionRef.current.start();
        } catch (e) { console.log("Mic start error", e); }
    };

    const stopListening = () => {
        setIsListening(false);
        if (recognitionRef.current) recognitionRef.current.stop();
    };

    // Parse & Next Step
    const handleNext = () => {
        stopListening();

        // 1. Save Data
        const stepId = STEPS[currentStep].id;
        let updatedData = { ...assessment };
        const text = transcript.toLowerCase();

        if (stepId === 'demographics') {
            // Basic parsing for Age
            const ageMatch = text.match(/(\d+)/);
            updatedData.age = ageMatch ? ageMatch[0] : updatedData.age;

            // Basic parsing for Gender
            if (text.includes('female') || text.includes('woman')) updatedData.gender = 'Female';
            else if (text.includes('male') || text.includes('man')) updatedData.gender = 'Male';
            else updatedData.gender = text; // Fallback to raw text if specific keywords not found

        } else if (stepId === 'issues') {
            // Rough split if user assumes "symptoms are X and issues are Y"
            // For now, we'll store the whole text in symptoms if not differentiated, 
            // but the prompt asks for both. 
            updatedData.symptoms = text;
            updatedData.issues = text; // Storing same context for now unless we add deeper NLP

        } else if (stepId === 'vitals') {
            // Targeted parsing for Vitals
            const bpMatch = text.match(/(\d{2,3}\/\d{2,3})/); // 120/80
            updatedData.bp = bpMatch ? bpMatch[0] : 'Not provided';

            const tempMatch = text.match(/(\d{2,3}(\.\d)?)/); // 98.6
            // Avoid capturing BP numbers as temp if possible, but regex is greedy. 
            // A simple heuristic: temp is usually < 110, BP systolic > 90.
            // For this basic version, we take what matches.
            updatedData.temp = tempMatch ? tempMatch[0] : 'Not provided';

            const hrMatch = text.match(/(\d{2,3})\s*(bpm|beats)/);
            updatedData.heart_rate = hrMatch ? hrMatch[1] : 'Not provided';
        } else if (stepId === 'additional') {
            updatedData.additional_info = transcript;
        }

        setAssessment(updatedData);
        console.log("Assessment Progress:", updatedData);

        // 2. Advance
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
            setTranscript('');
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    const stepData = STEPS[currentStep];
    const isComplete = currentStep === STEPS.length - 1;

    return (
        <div className="voice-intake-overlay">
            <div className="voice-intake-modal">

                {/* ── Steps Indicator ── */}
                {!isComplete && (
                    <div className="voice-steps">
                        {STEPS.slice(0, 4).map((s, i) => (
                            <div
                                key={s.id}
                                className={`voice-step ${i <= currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                            />
                        ))}
                    </div>
                )}

                {/* ── Content ── */}
                <div key={currentStep} className="voice-content-anim">
                    <h2 className="voice-title">{stepData.label}</h2>
                    <p className="voice-instruction">{stepData.prompt}</p>
                </div>

                {/* ── Mic Visual ── */}
                {!isComplete && (
                    <div
                        className={`voice-mic-area ${isListening ? 'listening' : ''}`}
                        onClick={toggleMic}
                    >
                        {isListening && <div className="voice-mic-pulse"></div>}
                        <span className="voice-mic-icon">
                            {isListening ? '⏸' : '🎙️'}
                        </span>
                    </div>
                )}

                {/* ── Transcript Area ── */}
                {!isComplete && (
                    <div className="voice-transcript">
                        {transcript ? (
                            `"${transcript}"`
                        ) : (
                            <span style={{ opacity: 0.4, fontStyle: 'italic' }}>
                                Tap microphone to speak...
                            </span>
                        )}
                    </div>
                )}

                {/* ── Summary (Complete State) ── */}
                {isComplete && (
                    <div className="voice-summary">
                        <p>Assessment data captured successfully.</p>
                        <div style={{ textAlign: 'left', background: '#f8f9fa', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '24px' }}>
                            <strong>Age:</strong> {assessment.age}<br />
                            <strong>Gender:</strong> {assessment.gender}<br />
                            <strong>Symptoms:</strong> {assessment.symptoms}<br />
                            <strong>Issues:</strong> {assessment.issues}<br />
                            <strong>BP:</strong> {assessment.bp}<br />
                            <strong>Temp:</strong> {assessment.temp}<br />
                            <strong>Heart Rate:</strong> {assessment.heart_rate}<br />
                            <strong>Additional Notes:</strong> {assessment.additional_info || 'None'}
                        </div>
                    </div>
                )}

                {/* ── Controls ── */}
                <div className="voice-controls">
                    {!isComplete ? (
                        <>
                            <button className="btn-voice-secondary" onClick={onClose}>Cancel</button>
                            <button className="btn-voice-primary" onClick={handleNext}>
                                {isListening ? 'Stop & Next' : 'Next Step →'}
                            </button>
                        </>
                    ) : (
                        <button className="btn-voice-primary" onClick={onClose}>Close Assessment</button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VoiceIntakeModal;
