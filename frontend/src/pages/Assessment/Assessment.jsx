import React, { useState, useCallback, useRef } from 'react';
import './Assessment.css';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import VoiceMic from '../../components/VoiceMic/VoiceMic';

const SYMPTOMS = [
    'Headache', 'Chest Pain', 'Fever', 'Dizziness', 'Shortness of Breath',
    'Nausea', 'Fatigue', 'Cough', 'Abdominal Pain', 'Back Pain',
    'Blurred Vision', 'Numbness', 'Swelling', 'Joint Pain', 'Anxiety',
    'Palpitations', 'Loss of Appetite', 'Insomnia', 'Sore Throat', 'Rash'
];

// Map spoken words to symptom matches
const SYMPTOM_ALIASES = {
    'headache': 'Headache', 'head ache': 'Headache', 'head hurts': 'Headache', 'migraine': 'Headache',
    'chest pain': 'Chest Pain', 'chest hurts': 'Chest Pain', 'chest tightness': 'Chest Pain',
    'fever': 'Fever', 'temperature': 'Fever', 'hot': 'Fever', 'chills': 'Fever',
    'dizzy': 'Dizziness', 'dizziness': 'Dizziness', 'light headed': 'Dizziness', 'lightheaded': 'Dizziness',
    'shortness of breath': 'Shortness of Breath', 'breathing': 'Shortness of Breath', 'breathless': 'Shortness of Breath', 'can\'t breathe': 'Shortness of Breath',
    'nausea': 'Nausea', 'nauseous': 'Nausea', 'sick': 'Nausea', 'vomiting': 'Nausea',
    'fatigue': 'Fatigue', 'tired': 'Fatigue', 'exhausted': 'Fatigue', 'weak': 'Fatigue',
    'cough': 'Cough', 'coughing': 'Cough',
    'abdominal pain': 'Abdominal Pain', 'stomach pain': 'Abdominal Pain', 'stomach ache': 'Abdominal Pain', 'belly pain': 'Abdominal Pain',
    'back pain': 'Back Pain', 'back ache': 'Back Pain', 'backache': 'Back Pain',
    'blurred vision': 'Blurred Vision', 'blurry vision': 'Blurred Vision', 'can\'t see': 'Blurred Vision',
    'numbness': 'Numbness', 'numb': 'Numbness', 'tingling': 'Numbness',
    'swelling': 'Swelling', 'swollen': 'Swelling', 'swelled': 'Swelling',
    'joint pain': 'Joint Pain', 'joints hurt': 'Joint Pain', 'arthritis': 'Joint Pain',
    'anxiety': 'Anxiety', 'anxious': 'Anxiety', 'nervous': 'Anxiety', 'panic': 'Anxiety',
    'palpitations': 'Palpitations', 'heart racing': 'Palpitations', 'heart beating fast': 'Palpitations',
    'loss of appetite': 'Loss of Appetite', 'not hungry': 'Loss of Appetite', 'no appetite': 'Loss of Appetite',
    'insomnia': 'Insomnia', 'can\'t sleep': 'Insomnia', 'trouble sleeping': 'Insomnia',
    'sore throat': 'Sore Throat', 'throat hurts': 'Sore Throat', 'throat pain': 'Sore Throat',
    'rash': 'Rash', 'skin rash': 'Rash', 'itchy': 'Rash', 'hives': 'Rash',
};

function matchSymptomsFromSpeech(text) {
    const lower = text.toLowerCase();
    const matched = new Set();
    const sortedAliases = Object.keys(SYMPTOM_ALIASES).sort((a, b) => b.length - a.length);
    for (const alias of sortedAliases) {
        if (lower.includes(alias)) matched.add(SYMPTOM_ALIASES[alias]);
    }
    for (const s of SYMPTOMS) {
        if (lower.includes(s.toLowerCase())) matched.add(s);
    }
    return [...matched];
}

const Assessment = ({ onComplete, onBack }) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({
        age: '', gender: '', patientId: 'P-' + Math.floor(1000 + Math.random() * 9000),
        symptoms: [], symptomDetails: '',
        heartRate: '', bp: '', temperature: '', spo2: '', height: '', weight: '', bmi: '',
        history: [], allergies: '', medications: ''
    });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [voiceMatched, setVoiceMatched] = useState([]);

    // Handlers
    const updateData = (key, value) => setData(prev => ({ ...prev, [key]: value }));
    const toggleSymptom = s => setData(p => ({ ...p, symptoms: p.symptoms.includes(s) ? p.symptoms.filter(x => x !== s) : [...p.symptoms, s] }));
    const toggleHistory = h => setData(p => ({ ...p, history: p.history.includes(h) ? p.history.filter(x => x !== h) : [...p.history, h] }));

    const next = async () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            setLoading(true);
            try {
                await onComplete(data);
            } finally {
                setLoading(false);
            }
        }
    };
    const prev = () => step > 0 ? setStep(step - 1) : onBack();

    // Voice
    const handleVoiceResult = useCallback((finalText) => {
        const matches = matchSymptomsFromSpeech(finalText);
        if (matches.length > 0) {
            setVoiceMatched(matches);
            setData(prev => ({ ...prev, symptoms: [...new Set([...prev.symptoms, ...matches])] }));
            setTimeout(() => setVoiceMatched([]), 3000);
        }
    }, []);

    const { isListening, isSupported, toggle: toggleVoice } = useSpeechRecognition({
        onResult: handleVoiceResult,
        continuous: false,
    });

    const STEPS = ['Basic Info', 'Symptoms', 'Vitals', 'History'];

    const filteredSymptoms = SYMPTOMS.filter(s => s.toLowerCase().includes(search.toLowerCase()));


    return (
        <div className="as-page-v2">
            <div className="as-container-v2">

                {/* Header */}
                <div className="as-header-v2">
                    <div className="as-progress-bar">
                        <div className="as-progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}></div>
                    </div>
                    <h1 className="as-step-title">{STEPS[step]}</h1>
                </div>

                {/* Form Content - Vertical Stack */}
                <div className="as-content-v2 fade-in">

                    {/* STEP 1: Basic Info */}
                    {step === 0 && (
                        <div className="as-stack">
                            <div className="as-field">
                                <label>Patient ID</label>
                                <input className="as-input-lg read-only" value={data.patientId} readOnly />
                            </div>
                            <div className="as-field">
                                <label>Age</label>
                                <input
                                    className="as-input-lg"
                                    type="number"
                                    placeholder="Enter age..."
                                    value={data.age}
                                    onChange={e => updateData('age', e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="as-field">
                                <label>Gender</label>
                                <div className="as-select-row">
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <button
                                            key={g}
                                            className={`as-select-pill ${data.gender === g ? 'active' : ''}`}
                                            onClick={() => updateData('gender', g)}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Symptoms */}
                    {step === 1 && (
                        <div className="as-stack">
                            <div className="as-voice-mic-centered">
                                <VoiceMic isListening={isListening} isSupported={isSupported} onToggle={toggleVoice} />
                                <p className="as-mic-hint">{isListening ? 'Listening...' : 'Tap for Voice Input'}</p>
                            </div>

                            <div className="as-field">
                                <input
                                    className="as-input-search"
                                    placeholder="Search symptoms..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="as-chips-wrap">
                                {filteredSymptoms.map(s => (
                                    <button
                                        key={s}
                                        className={`as-chip-v2 ${data.symptoms.includes(s) ? 'active' : ''} ${voiceMatched.includes(s) ? 'pulse' : ''}`}
                                        onClick={() => toggleSymptom(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <div className="as-field">
                                <label>Additional Details</label>
                                <textarea
                                    className="as-textarea"
                                    placeholder="Describe severity, duration..."
                                    value={data.symptomDetails}
                                    onChange={e => updateData('symptomDetails', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Vitals - VERTICAL LIST */}
                    {step === 2 && (
                        <div className="as-stack">
                            <div className="as-field-row">
                                <div className="as-field-label-group">
                                    <label>Heart Rate</label>
                                    <span className="as-unit">BPM</span>
                                </div>
                                <input
                                    className="as-input-xl"
                                    type="number"
                                    placeholder="--"
                                    value={data.heartRate}
                                    onChange={e => updateData('heartRate', e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="as-field-row">
                                <div className="as-field-label-group">
                                    <label>Blood Pressure</label>
                                    <span className="as-unit">mmHg</span>
                                </div>
                                <input
                                    className="as-input-xl"
                                    type="text"
                                    placeholder="120/80"
                                    value={data.bp}
                                    onChange={e => updateData('bp', e.target.value)}
                                />
                            </div>

                            <div className="as-field-row">
                                <div className="as-field-label-group">
                                    <label>Temperature</label>
                                    <span className="as-unit">°F</span>
                                </div>
                                <input
                                    className="as-input-xl"
                                    type="number"
                                    placeholder="--"
                                    value={data.temperature}
                                    onChange={e => updateData('temperature', e.target.value)}
                                />
                            </div>

                            <div className="as-field-row">
                                <div className="as-field-label-group">
                                    <label>SpO₂</label>
                                    <span className="as-unit">%</span>
                                </div>
                                <input
                                    className="as-input-xl"
                                    type="number"
                                    placeholder="--"
                                    value={data.spo2}
                                    onChange={e => updateData('spo2', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 4: History */}
                    {step === 3 && (
                        <div className="as-stack">
                            <label className="as-section-label">Existing Conditions</label>
                            <div className="as-list-select">
                                {['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid Disorder', 'Kidney Disease'].map(h => (
                                    <button
                                        key={h}
                                        className={`as-list-item ${data.history.includes(h) ? 'active' : ''}`}
                                        onClick={() => toggleHistory(h)}
                                    >
                                        <span className="circle-check">{data.history.includes(h) && '✓'}</span>
                                        {h}
                                    </button>
                                ))}
                            </div>

                            <div className="as-field">
                                <label>Medications</label>
                                <input className="as-input-lg" placeholder="List active meds..." value={data.medications} onChange={e => updateData('medications', e.target.value)} />
                            </div>

                            <div className="as-field">
                                <label>Allergies</label>
                                <input className="as-input-lg" placeholder="List allergies..." value={data.allergies} onChange={e => updateData('allergies', e.target.value)} />
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="as-footer-v2">
                    <button className="as-btn-back" onClick={prev} disabled={loading}>
                        {step === 0 ? 'Exit' : 'Back'}
                    </button>
                    <button className="as-btn-primary" onClick={next} disabled={loading}>
                        {loading ? 'Analyzing...' : (step === 3 ? 'Finish' : 'Continue')}
                        {!loading && <span className="arrow">→</span>}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Assessment;
