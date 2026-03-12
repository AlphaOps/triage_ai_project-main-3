import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VoiceAgent.css';

/* ═══════════════════════════════════════════════════════════════════
   SYMPTOM INTELLIGENCE — keyword extraction & clinical mapping
   ═══════════════════════════════════════════════════════════════════ */

const SYMPTOM_MAP = {
    'headache': 'Headache', 'head hurts': 'Headache', 'head pain': 'Headache', 'migraine': 'Headache', 'head ache': 'Headache',
    'chest pain': 'Chest Pain', 'chest hurts': 'Chest Pain', 'chest tightness': 'Chest Pain', 'pressure in chest': 'Chest Pain',
    'fever': 'Fever', 'temperature': 'Fever', 'chills': 'Fever', 'feeling hot': 'Fever', 'high temperature': 'Fever',
    'dizzy': 'Dizziness', 'dizziness': 'Dizziness', 'lightheaded': 'Dizziness', 'room spinning': 'Dizziness', 'vertigo': 'Dizziness',
    'shortness of breath': 'Shortness of Breath', 'breathing difficulty': 'Shortness of Breath', 'breathless': 'Shortness of Breath',
    'hard to breathe': 'Shortness of Breath', 'can\'t breathe': 'Shortness of Breath', 'difficulty breathing': 'Shortness of Breath',
    'nausea': 'Nausea', 'nauseous': 'Nausea', 'vomiting': 'Nausea', 'throwing up': 'Nausea', 'feel sick': 'Nausea',
    'fatigue': 'Fatigue', 'tired': 'Fatigue', 'exhausted': 'Fatigue', 'no energy': 'Fatigue', 'worn out': 'Fatigue',
    'cough': 'Cough', 'coughing': 'Cough', 'dry cough': 'Cough', 'wet cough': 'Cough',
    'abdominal pain': 'Abdominal Pain', 'stomach pain': 'Abdominal Pain', 'stomach ache': 'Abdominal Pain',
    'belly hurts': 'Abdominal Pain', 'tummy ache': 'Abdominal Pain', 'stomach cramps': 'Abdominal Pain',
    'back pain': 'Back Pain', 'backache': 'Back Pain', 'back hurts': 'Back Pain', 'lower back': 'Back Pain',
    'blurred vision': 'Blurred Vision', 'blurry': 'Blurred Vision', 'vision problems': 'Blurred Vision', 'can\'t see clearly': 'Blurred Vision',
    'numbness': 'Numbness', 'numb': 'Numbness', 'tingling': 'Numbness', 'pins and needles': 'Numbness',
    'swelling': 'Swelling', 'swollen': 'Swelling', 'puffiness': 'Swelling',
    'joint pain': 'Joint Pain', 'joints hurt': 'Joint Pain', 'achy joints': 'Joint Pain', 'knee pain': 'Joint Pain',
    'anxiety': 'Anxiety', 'anxious': 'Anxiety', 'panic': 'Anxiety', 'nervous': 'Anxiety', 'worried': 'Anxiety',
    'palpitations': 'Palpitations', 'heart racing': 'Palpitations', 'heart beating fast': 'Palpitations', 'heart flutter': 'Palpitations',
    'loss of appetite': 'Loss of Appetite', 'not hungry': 'Loss of Appetite', 'don\'t feel like eating': 'Loss of Appetite',
    'insomnia': 'Insomnia', 'can\'t sleep': 'Insomnia', 'trouble sleeping': 'Insomnia', 'not sleeping': 'Insomnia',
    'sore throat': 'Sore Throat', 'throat hurts': 'Sore Throat', 'scratchy throat': 'Sore Throat',
    'rash': 'Rash', 'skin rash': 'Rash', 'itchy': 'Rash', 'itching': 'Rash', 'hives': 'Rash',
    'muscle pain': 'Muscle Pain', 'muscles hurt': 'Muscle Pain', 'body aches': 'Muscle Pain', 'sore muscles': 'Muscle Pain',
    'ear pain': 'Ear Pain', 'ear ache': 'Ear Pain', 'ear hurts': 'Ear Pain',
    'runny nose': 'Runny Nose', 'stuffy nose': 'Nasal Congestion', 'congestion': 'Nasal Congestion', 'blocked nose': 'Nasal Congestion',
    'diarrhea': 'Diarrhea', 'loose stools': 'Diarrhea', 'upset stomach': 'Diarrhea',
    'constipation': 'Constipation', 'bloating': 'Bloating', 'bloated': 'Bloating',
    'weight loss': 'Weight Loss', 'losing weight': 'Weight Loss',
    'sneezing': 'Sneezing', 'watery eyes': 'Watery Eyes',
};

function extractSymptoms(text) {
    const lower = text.toLowerCase();
    const found = new Set();
    const sorted = Object.keys(SYMPTOM_MAP).sort((a, b) => b.length - a.length);
    for (const alias of sorted) {
        if (lower.includes(alias)) found.add(SYMPTOM_MAP[alias]);
    }
    return [...found];
}

function determinePriority(symptoms) {
    const high = ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'Blurred Vision', 'Numbness'];
    const med = ['Dizziness', 'Abdominal Pain', 'Fever', 'Swelling', 'Back Pain', 'Joint Pain'];
    if (symptoms.some(s => high.includes(s))) return 'HIGH';
    if (symptoms.length >= 3 || symptoms.some(s => med.includes(s))) return 'MEDIUM';
    return 'LOW';
}

function suggestDepartment(symptoms, priority) {
    if (symptoms.includes('Chest Pain') || symptoms.includes('Palpitations')) return 'Cardiology';
    if (symptoms.includes('Shortness of Breath') || symptoms.includes('Cough')) return 'Pulmonology';
    if (symptoms.includes('Blurred Vision') || symptoms.includes('Numbness') || symptoms.includes('Headache')) return 'Neurology';
    if (symptoms.includes('Abdominal Pain') || symptoms.includes('Diarrhea') || symptoms.includes('Constipation')) return 'Gastroenterology';
    if (symptoms.includes('Back Pain') || symptoms.includes('Joint Pain') || symptoms.includes('Muscle Pain')) return 'Orthopedics';
    if (symptoms.includes('Rash') || symptoms.includes('Swelling')) return 'Dermatology';
    if (symptoms.includes('Anxiety') || symptoms.includes('Insomnia')) return 'Psychiatry';
    if (symptoms.includes('Ear Pain')) return 'ENT';
    if (symptoms.includes('Sore Throat') || symptoms.includes('Runny Nose') || symptoms.includes('Nasal Congestion')) return 'ENT';
    if (priority === 'HIGH') return 'Emergency Medicine';
    return 'General Medicine';
}


/* ═══════════════════════════════════════════════════════════════════
   CONVERSATIONAL INTELLIGENCE ENGINE
   Context-aware, nurse-like, concise, empathetic, non-diagnostic
   ═══════════════════════════════════════════════════════════════════ */

/* Associated symptom mapping — if patient reports X, probe for Y */
const ASSOCIATED_SYMPTOMS = {
    'Headache': ['Blurred Vision', 'Nausea', 'Dizziness', 'Numbness'],
    'Chest Pain': ['Shortness of Breath', 'Palpitations', 'Dizziness', 'Nausea'],
    'Fever': ['Cough', 'Sore Throat', 'Fatigue', 'Muscle Pain'],
    'Dizziness': ['Headache', 'Blurred Vision', 'Nausea', 'Numbness'],
    'Shortness of Breath': ['Chest Pain', 'Cough', 'Fatigue', 'Palpitations'],
    'Nausea': ['Abdominal Pain', 'Dizziness', 'Fever', 'Loss of Appetite'],
    'Abdominal Pain': ['Nausea', 'Diarrhea', 'Bloating', 'Fever', 'Loss of Appetite'],
    'Back Pain': ['Numbness', 'Joint Pain', 'Muscle Pain'],
    'Cough': ['Fever', 'Sore Throat', 'Shortness of Breath', 'Nasal Congestion'],
    'Anxiety': ['Insomnia', 'Palpitations', 'Fatigue', 'Headache'],
    'Rash': ['Fever', 'Swelling', 'Joint Pain'],
    'Palpitations': ['Chest Pain', 'Anxiety', 'Dizziness', 'Shortness of Breath'],
};

/** Severity-related keywords */
const SEVERITY_KEYWORDS = {
    high: ['severe', 'worst', 'unbearable', 'excruciating', 'terrible', '9', '10', 'really bad', 'extremely', 'sharp', 'can\'t take it', 'worst ever'],
    moderate: ['moderate', 'pretty bad', 'uncomfortable', 'annoying', '5', '6', '7', '8', 'fairly', 'quite', 'noticeably'],
    low: ['mild', 'slight', 'minor', 'little', '1', '2', '3', '4', 'barely', 'tolerable', 'manageable', 'not that bad'],
};

/** Duration-related keywords */
const DURATION_KEYWORDS = ['today', 'yesterday', 'this morning', 'last night', 'few days', 'a week', 'weeks', 'month', 'months',
    'started', 'began', 'since', 'for about', 'couple of days', 'couple days', 'hours', 'just now', 'recently',
    'on and off', 'comes and goes', 'chronic', 'always', 'years', 'long time'];

/** Medication-related keywords */
const MEDICATION_KEYWORDS = ['medication', 'medicine', 'pills', 'tablets', 'prescription', 'taking', 'ibuprofen', 'aspirin',
    'paracetamol', 'tylenol', 'advil', 'antibiotics', 'inhaler', 'insulin', 'blood pressure', 'cholesterol',
    'no medication', 'nothing', 'none', 'not taking anything', 'no medicine', 'supplements', 'vitamins'];

/** Allergy-related keywords */
const ALLERGY_KEYWORDS = ['allergy', 'allergic', 'no allergies', 'penicillin', 'latex', 'shellfish', 'peanuts',
    'none that I know', 'no known allergies'];

/* ── Conversation phase constants ── */
const PHASE = {
    GREETING: 'greeting',
    INITIAL_COLLECTION: 'initial_collection',
    SYMPTOM_CLARIFY: 'symptom_clarify',
    SEVERITY_PROBE: 'severity_probe',
    DURATION_PROBE: 'duration_probe',
    ASSOCIATED_CHECK: 'associated_check',
    MEDICATION_PROBE: 'medication_probe',
    HISTORY_PROBE: 'history_probe',
    ALLERGY_PROBE: 'allergy_probe',
    WRAPUP: 'wrapup',
    COMPLETE: 'complete',
};

/* ── Response variation pools ── */
const RESPONSE_POOL = {
    acknowledgments: [
        "Thank you for sharing that.",
        "I understand.",
        "I appreciate you telling me.",
        "Thank you. That's helpful.",
        "Got it, thank you.",
        "Understood.",
        "Thank you for letting me know.",
        "I see, that's important to note.",
    ],
    reassurance: [
        "You're doing great. Just a few more things I'd like to understand.",
        "Thank you for being so clear. This helps us help you better.",
        "You're providing very helpful information. Let's continue.",
        "I appreciate your patience. We're almost through the key questions.",
    ],
    severity_questions: [
        "On a scale of one to ten, how would you rate the intensity right now?",
        "How would you describe the severity — mild, moderate, or severe?",
        "Would you say the discomfort is manageable, or is it significantly affecting your day?",
        "How intense would you say this is on a scale of one to ten?",
    ],
    duration_questions: [
        "When did you first notice these symptoms?",
        "Can you recall when this started?",
        "How long have you been experiencing this?",
        "Is this something that started recently, or has it been going on for a while?",
    ],
    medication_questions: [
        "Are you currently taking any medications, including over-the-counter ones?",
        "Have you taken anything for these symptoms? Any regular medications?",
        "Are there any medications you take regularly, or anything you've tried for this?",
    ],
    allergy_questions: [
        "Do you have any known allergies to medications or other substances?",
        "Are there any allergies we should be aware of?",
        "Any medication allergies or sensitivities?",
    ],
    history_questions: [
        "Have you experienced anything like this before?",
        "Is this the first time you've had these symptoms, or is it recurring?",
        "Does this feel similar to anything you've experienced in the past?",
    ],
    transition_phrases: [
        "I'd like to understand a bit more.",
        "Let me ask you about another aspect.",
        "I have a couple of additional questions.",
        "There's one more thing I'd like to clarify.",
    ],
};

/** Build a contextual follow-up for a specific symptom */
function buildSymptomClarification(symptom) {
    const clarifications = {
        'Headache': [
            "Where exactly is the pain — front, back, or sides of your head?",
            "Is the headache constant, or does it come in waves?",
            "Does light or noise make the headache worse?",
        ],
        'Chest Pain': [
            "Can you describe the chest sensation — is it sharp, dull, or more of a pressure?",
            "Does the discomfort change when you breathe deeply or move?",
            "Does the pain spread to your arm, jaw, or back?",
        ],
        'Fever': [
            "Have you been able to check your temperature? If so, what was it?",
            "Are you experiencing any chills or sweating along with the fever?",
            "Has the fever been continuous, or does it come and go?",
        ],
        'Dizziness': [
            "Does the room seem to spin, or is it more of a lightheadedness?",
            "Does the dizziness happen when you stand up, or is it constant?",
            "Have you had any recent falls or close calls from the dizziness?",
        ],
        'Abdominal Pain': [
            "Where in your abdomen is the pain? Upper, lower, left, or right side?",
            "Is the pain sharp and sudden, or more of a dull, constant ache?",
            "Is the pain related to eating or certain foods?",
        ],
        'Shortness of Breath': [
            "Does the breathing difficulty happen at rest, or mainly with activity?",
            "Do you notice it more when lying down?",
            "Have you had any wheezing or tightness along with it?",
        ],
        'Back Pain': [
            "Is the pain in your upper back or lower back?",
            "Does the pain radiate down your legs at all?",
            "Did anything specific trigger it, like lifting or sudden movement?",
        ],
        'Cough': [
            "Is the cough dry, or are you bringing up any mucus?",
            "Have you noticed any blood when you cough?",
            "Does the cough get worse at night?",
        ],
        'Nausea': [
            "Have you actually been sick, or is it just a feeling of nausea?",
            "Is the nausea constant, or does it come in waves?",
            "Do certain smells or foods make it worse?",
        ],
        'Anxiety': [
            "Are there specific situations that trigger the anxious feelings?",
            "Have you noticed any physical symptoms with the anxiety, like a racing heart?",
            "How is this affecting your daily life and sleep?",
        ],
        'Rash': [
            "Where on your body is the rash?",
            "Is the rash itchy, painful, or neither?",
            "Have you started any new products or medications recently?",
        ],
        'Palpitations': [
            "Do the palpitations happen suddenly, or gradually build?",
            "Do you notice them more at rest or during activity?",
            "How long do the episodes typically last?",
        ],
        'Joint Pain': [
            "Which joints are affected?",
            "Are the joints swollen or stiff, especially in the morning?",
            "Does movement make the pain better or worse?",
        ],
    };
    const pool = clarifications[symptom];
    if (pool) return pool[Math.floor(Math.random() * pool.length)];
    return `Can you describe the ${symptom.toLowerCase()} in a bit more detail?`;
}

/** Pick random item from an array, avoiding last used */
function pickRandom(pool, lastUsed) {
    const avail = pool.filter(p => p !== lastUsed);
    return avail[Math.floor(Math.random() * avail.length)] || pool[0];
}

/** Detect severity from text */
function detectSeverity(text) {
    const lower = text.toLowerCase();
    for (const lvl of ['high', 'moderate', 'low']) {
        if (SEVERITY_KEYWORDS[lvl].some(k => lower.includes(k))) return lvl;
    }
    return null;
}

/** Detect if duration info is present */
function hasDurationInfo(text) {
    const lower = text.toLowerCase();
    return DURATION_KEYWORDS.some(k => lower.includes(k));
}

/** Detect if medication info is present */
function hasMedicationInfo(text) {
    const lower = text.toLowerCase();
    return MEDICATION_KEYWORDS.some(k => lower.includes(k));
}

/** Detect if allergy info is present */
function hasAllergyInfo(text) {
    const lower = text.toLowerCase();
    return ALLERGY_KEYWORDS.some(k => lower.includes(k));
}


/* ═══════════════════════════════════════════════════════════════════
   VOICE AGENT COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const VoiceAgent = ({ mode = 'general', onBack }) => {
    /* ─── Core state ─── */
    const [agentState, setAgentState] = useState('idle');
    const [transcript, setTranscript] = useState('');
    const [displayText, setDisplayText] = useState('');
    const [statements, setStatements] = useState([]);
    const [symptoms, setSymptoms] = useState([]);
    const [showPanel, setShowPanel] = useState(false);
    const [sessionActive, setSessionActive] = useState(true);
    const [sessionEnded, setSessionEnded] = useState(false);

    /* ─── Conversation intelligence state ─── */
    const [phase, setPhase] = useState(PHASE.GREETING);
    const [turnCount, setTurnCount] = useState(0);
    const [hasSeverity, setHasSeverity] = useState(false);
    const [hasDuration, setHasDuration] = useState(false);
    const [hasMedication, setHasMedication] = useState(false);
    const [hasAllergy, setHasAllergy] = useState(false);
    const [hasHistory, setHasHistory] = useState(false);
    const [clarifiedSymptoms, setClarifiedSymptoms] = useState(new Set());
    const [associatedChecked, setAssociatedChecked] = useState(new Set());
    const [lastAck, setLastAck] = useState('');
    const [detectedSeverity, setDetectedSeverity] = useState(null);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [conversationLog, setConversationLog] = useState([]);

    /* ─── Refs ─── */
    const recognitionRef = useRef(null);
    const synthRef = useRef(null);
    const displayTimerRef = useRef(null);
    const stateRef = useRef({});

    /* Keep a ref to latest state for callbacks */
    stateRef.current = {
        phase, turnCount, symptoms, hasSeverity, hasDuration,
        hasMedication, hasAllergy, hasHistory, clarifiedSymptoms,
        associatedChecked, lastAck, statements
    };

    /* ─── Speech Recognition Setup ─── */
    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SR) {
            const recognition = new SR();
            recognition.lang = 'en-US';
            recognition.interimResults = true;
            recognition.continuous = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event) => {
                let interim = '';
                let finalText = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalText += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }
                setTranscript(finalText || interim);
                if (finalText) {
                    handleUserSpeech(finalText.trim());
                }
            };

            recognition.onend = () => {
                setAgentState(prev => prev === 'listening' ? 'idle' : prev);
            };

            recognition.onerror = () => {
                setAgentState('idle');
            };

            recognitionRef.current = recognition;
        }

        synthRef.current = window.speechSynthesis;

        return () => {
            recognitionRef.current?.abort();
            synthRef.current?.cancel();
            clearInterval(displayTimerRef.current);
        };
    }, []);

    /* ─── Speak text with typewriter display ─── */
    const speakText = useCallback((text, onDone) => {
        setAgentState('speaking');
        setDisplayText('');
        setConversationLog(prev => [...prev, { role: 'agent', text }]);

        // Typewriter
        let i = 0;
        clearInterval(displayTimerRef.current);
        displayTimerRef.current = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(displayTimerRef.current);
            }
        }, 26);

        // Synthesis
        if (synthRef.current) {
            synthRef.current.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.rate = 0.92;
            utter.pitch = 1.0;
            utter.lang = 'en-US';
            const voices = synthRef.current.getVoices();
            const preferred = voices.find(v =>
                v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Victoria')
            );
            if (preferred) utter.voice = preferred;

            utter.onend = () => {
                setAgentState('idle');
                if (onDone) onDone();
            };
            utter.onerror = () => {
                setAgentState('idle');
                if (onDone) onDone();
            };
            synthRef.current.speak(utter);
        } else {
            setTimeout(() => {
                setAgentState('idle');
                if (onDone) onDone();
            }, text.length * 28 + 600);
        }
    }, []);

    /* ─── Start: agent greets ─── */
    useEffect(() => {
        if (!sessionActive) return;
        const timer = setTimeout(() => {
            if (mode === 'assessment') {
                speakText("Hello. I'm your Clinical Intake Assistant. I'll be gathering your assessment information today. Whenever you're ready, please describe the symptoms you're experiencing.");
                setPhase(PHASE.INITIAL_COLLECTION);
            } else {
                speakText("Hello! I'm SimpTons AI, your clinical guide. I can help with general health questions or navigate you around the platform. How can I assist you today?");
                setPhase('general_chat');
            }
        }, 900);
        return () => clearTimeout(timer);
    }, [sessionActive, speakText, mode]);


    /* ═══════════════════════════════════════════════════════════
       CONVERSATION ENGINE — generates contextual next response
       ═══════════════════════════════════════════════════════════ */

    const generateResponse = useCallback((userText, newSymptoms) => {
        const s = stateRef.current;
        const allSymptoms = [...new Set([...s.symptoms, ...newSymptoms])];
        const turn = s.turnCount + 1;

        // --- Check for diagnosis/medication keywords & show disclaimer ---
        const diagnosisWords = ['diagnose', 'diagnosis', 'what do i have', 'is it cancer',
            'prescribe', 'medication for', 'what medicine', 'what should i take',
            'do i have', 'am i sick', 'what\'s wrong with me', 'treat'];
        const lower = userText.toLowerCase();
        if (diagnosisWords.some(w => lower.includes(w))) {
            setShowDisclaimer(true);
            setTimeout(() => setShowDisclaimer(false), 8000);
            return "I understand your concern. Please keep in mind that I'm here to gather information to help guide your care. A medical professional will review your details and provide proper guidance. Let's continue so I can capture everything they'll need.";
        }

        // --- PHASE 1: Initial gathering (turns 1-2) —  collect main symptoms ---
        if (turn <= 2 && allSymptoms.length === 0) {
            // No symptoms detected yet — ask for more detail
            if (turn === 1) {
                return "I want to make sure I understand. Could you describe the main thing that's troubling you in your own words?";
            }
            return "Take your time. Even small details help — any pain, discomfort, or changes you've noticed recently?";
        }

        // --- If we have symptoms, start the clinical probing cycle ---
        if (allSymptoms.length > 0) {

            // Build acknowledgment with contextual symptom mention
            const ack = pickRandom(RESPONSE_POOL.acknowledgments, s.lastAck);
            setLastAck(ack);

            // Priority: clarify an unclarified symptom
            const unclarified = allSymptoms.filter(sym => !s.clarifiedSymptoms.has(sym));
            if (unclarified.length > 0 && turn <= 8) {
                const target = unclarified[0];
                setClarifiedSymptoms(prev => new Set([...prev, target]));
                setPhase(PHASE.SYMPTOM_CLARIFY);
                const clarQ = buildSymptomClarification(target);
                // For first symptom, add a brief comment
                if (turn <= 2 && newSymptoms.length > 0) {
                    const symptomList = newSymptoms.slice(0, 2).map(s => s.toLowerCase()).join(' and ');
                    return `${ack} I'm noting the ${symptomList}. ${clarQ}`;
                }
                return `${ack} ${clarQ}`;
            }

            // Severity not yet gathered
            if (!s.hasSeverity) {
                setHasSeverity(true);
                setPhase(PHASE.SEVERITY_PROBE);
                const sev = detectSeverity(userText);
                if (sev) {
                    setDetectedSeverity(sev);
                    // Already mentioned severity — acknowledge and move on
                    const severityWord = sev === 'high' ? 'intense' : sev === 'moderate' ? 'moderate' : 'mild';
                    return `I've noted that as ${severityWord}. ${pickRandom(RESPONSE_POOL.duration_questions, '')}`;
                }
                return `${ack} ${pickRandom(RESPONSE_POOL.severity_questions, '')}`;
            }

            // Check for severity in current response if we just asked
            if (s.phase === PHASE.SEVERITY_PROBE && !detectedSeverity) {
                const sev = detectSeverity(userText);
                if (sev) setDetectedSeverity(sev);
            }

            // Duration not yet gathered
            if (!s.hasDuration) {
                const dur = hasDurationInfo(userText);
                if (dur) {
                    setHasDuration(true);
                    // Patient already mentioned duration — skip to next
                } else {
                    setHasDuration(true);
                    setPhase(PHASE.DURATION_PROBE);
                    return `${ack} ${pickRandom(RESPONSE_POOL.duration_questions, '')}`;
                }
            }

            // Associated symptom check — find symptoms not yet mentioned
            const primarySymptom = allSymptoms[0];
            const associated = ASSOCIATED_SYMPTOMS[primarySymptom] || [];
            const uncheckedAssociated = associated.filter(a =>
                !allSymptoms.includes(a) && !s.associatedChecked.has(a)
            );
            if (uncheckedAssociated.length > 0 && !s.associatedChecked.has(primarySymptom)) {
                setAssociatedChecked(prev => new Set([...prev, primarySymptom]));
                setPhase(PHASE.ASSOCIATED_CHECK);
                const checkList = uncheckedAssociated.slice(0, 2).map(s => s.toLowerCase()).join(' or ');
                return `${ack} Sometimes with ${primarySymptom.toLowerCase()}, people also notice ${checkList}. Have you experienced anything like that?`;
            }

            // Medical history
            if (!s.hasHistory) {
                setHasHistory(true);
                setPhase(PHASE.HISTORY_PROBE);
                return `${pickRandom(RESPONSE_POOL.reassurance, '')} ${pickRandom(RESPONSE_POOL.history_questions, '')}`;
            }

            // Medication probe
            if (!s.hasMedication) {
                const medInfo = hasMedicationInfo(userText);
                if (medInfo) {
                    setHasMedication(true);
                } else {
                    setHasMedication(true);
                    setPhase(PHASE.MEDICATION_PROBE);
                    return `${ack} ${pickRandom(RESPONSE_POOL.medication_questions, '')}`;
                }
            }

            // Allergy probe
            if (!s.hasAllergy) {
                const allergyInfo = hasAllergyInfo(userText);
                if (allergyInfo) {
                    setHasAllergy(true);
                } else {
                    setHasAllergy(true);
                    setPhase(PHASE.ALLERGY_PROBE);
                    return `${ack} ${pickRandom(RESPONSE_POOL.allergy_questions, '')}`;
                }
            }

            // Wrapup phase
            if (mode === 'assessment') {
                setPhase(PHASE.WRAPUP);
                const priority = determinePriority(allSymptoms);
                const dept = suggestDepartment(allSymptoms, priority);

                const symptomCount = allSymptoms.length;
                const symptomWord = symptomCount === 1 ? 'symptom' : 'symptoms';

                if (priority === 'HIGH') {
                    return `Thank you for being so thorough. Based on what you've described, I've identified ${symptomCount} ${symptomWord} that warrant prompt attention. I'd recommend being seen by ${dept} as soon as possible. Your findings are ready in the panel.`;
                } else if (priority === 'MEDIUM') {
                    return `I appreciate your patience. I've captured ${symptomCount} ${symptomWord} from our conversation. It would be a good idea to follow up with ${dept}. You can review everything in the Findings panel.`;
                }
                return `Thank you for sharing all of that. I've noted ${symptomCount} ${symptomWord}. Based on what you've described, a visit to ${dept} would be a reasonable next step. Your summary is available in the Findings panel.`;
            } else {
                return `I see. I've noted those points. Is there anything specific you'd like to know about these symptoms, or any other area of your care I can help with?`;
            }
        }

        // --- General Mode Handling ---
        if (mode === 'general') {
            if (lower.includes('doctor') || lower.includes('specialist')) {
                return "I can certainly help with that. You can use the 'Find a Specialist' feature on your dashboard to see practitioners near you. Would you like me to guide you there?";
            }
            if (lower.includes('prescription') || lower.includes('report')) {
                return "You can upload and scan your medical reports using the 'Scan Report' button on the home screen. It will help us build your clinical timeline.";
            }
            if (lower.includes('history') || lower.includes('timeline')) {
                return "Your health journey is tracked in the 'Health Timeline' section. You can view all your past assessments and reports there.";
            }
            return "I understand. I'm here to provide general guidance and help you navigate your care. What else can I do for you?";
        }

        // Fallback — no symptoms detected after several turns
        if (turn >= 4 && allSymptoms.length === 0) {
            return "I want to make sure I capture everything correctly. Could you describe what's been most uncomfortable or concerning for you?";
        }

        // Generic continuation
        return `${pickRandom(RESPONSE_POOL.acknowledgments, s.lastAck)} Can you tell me a little more about what you've been experiencing?`;

    }, [detectedSeverity]);


    /* ─── Handle user speech ─── */
    const handleUserSpeech = useCallback((text) => {
        setStatements(prev => [...prev, text]);
        setConversationLog(prev => [...prev, { role: 'user', text }]);

        // Extract symptoms
        const found = extractSymptoms(text);
        let updatedSymptoms = [...stateRef.current.symptoms];
        if (found.length > 0) {
            updatedSymptoms = [...new Set([...updatedSymptoms, ...found])];
            setSymptoms(updatedSymptoms);
        }

        // Detect inline info
        if (hasDurationInfo(text)) setHasDuration(true);
        if (hasMedicationInfo(text)) setHasMedication(true);
        if (hasAllergyInfo(text)) setHasAllergy(true);
        const sev = detectSeverity(text);
        if (sev && !stateRef.current.hasSeverity) {
            setHasSeverity(true);
            setDetectedSeverity(sev);
        }

        // Generate contextual response
        const response = generateResponse(text, found);

        setTurnCount(prev => prev + 1);

        // Think, then respond
        setAgentState('thinking');
        const thinkDelay = 800 + Math.random() * 800; // 0.8-1.6s variation
        setTimeout(() => {
            speakText(response, () => {
                // After wrapup, auto-open findings
                if (stateRef.current.phase === PHASE.WRAPUP) {
                    setTimeout(() => setShowPanel(true), 500);
                }
            });
        }, thinkDelay);
    }, [generateResponse, speakText]);


    /* ─── Mic toggle ─── */
    const toggleMic = () => {
        if (agentState === 'listening') {
            recognitionRef.current?.stop();
            setAgentState('idle');
        } else if (agentState === 'idle' && recognitionRef.current) {
            setTranscript('');
            try {
                recognitionRef.current.start();
                setAgentState('listening');
            } catch (e) { /* already started */ }
        }
    };

    /* ─── End session ─── */
    const endSession = () => {
        recognitionRef.current?.abort();
        synthRef.current?.cancel();
        clearInterval(displayTimerRef.current);
        setSessionActive(false);
        setSessionEnded(true);
        setAgentState('idle');
    };

    /* ─── Computed findings ─── */
    const priority = symptoms.length > 0 ? determinePriority(symptoms) : null;
    const department = symptoms.length > 0 ? suggestDepartment(symptoms, priority) : null;

    const statusLabel = {
        idle: 'Ready',
        listening: 'Listening',
        thinking: 'Analysing',
        speaking: 'Speaking',
    }[agentState];


    /* ═══════════════════════════════════════════════════════════
       SESSION ENDED SCREEN
       ═══════════════════════════════════════════════════════════ */

    if (sessionEnded) {
        return (
            <div className="va-page">
                <div className="va-ended">
                    <div className="va-ended-icon">✦</div>
                    <h2>Session Complete</h2>
                    <p>Your voice assessment has been recorded.</p>
                    {symptoms.length > 0 && (
                        <div className="va-ended-summary">
                            <div className={`va-ended-priority ${priority?.toLowerCase()}`}>{priority} PRIORITY</div>
                            <p>Department: <strong>{department}</strong></p>
                            <p>{symptoms.length} symptom{symptoms.length !== 1 ? 's' : ''} identified</p>
                            {detectedSeverity && (
                                <p>Reported severity: <strong>{detectedSeverity}</strong></p>
                            )}
                        </div>
                    )}
                    <div className="va-ended-stats">
                        <div className="va-ended-stat">
                            <span className="va-ended-stat-num">{statements.length}</span>
                            <span className="va-ended-stat-label">Exchanges</span>
                        </div>
                        <div className="va-ended-stat">
                            <span className="va-ended-stat-num">{symptoms.length}</span>
                            <span className="va-ended-stat-label">Symptoms</span>
                        </div>
                        <div className="va-ended-stat">
                            <span className="va-ended-stat-num">{conversationLog.length}</span>
                            <span className="va-ended-stat-label">Messages</span>
                        </div>
                    </div>
                    <button className="btn-primary va-ended-btn" onClick={onBack}>Return to Dashboard</button>
                </div>
            </div>
        );
    }


    /* ═══════════════════════════════════════════════════════════
       MAIN INTERFACE
       ═══════════════════════════════════════════════════════════ */

    return (
        <div className="va-page">
            {/* ─── Top Bar ─── */}
            <header className="va-topbar">
                <div className="va-topbar-left">
                    <button className="va-back" onClick={onBack} aria-label="Go back">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="va-label">Voice Agent <span className="va-beta">Beta</span></span>
                </div>
                <button className={`va-findings-btn ${showPanel ? 'active' : ''}`} onClick={() => setShowPanel(!showPanel)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                    Findings
                    {symptoms.length > 0 && <span className="va-findings-count">{symptoms.length}</span>}
                </button>
            </header>

            {/* ─── Center Stage ─── */}
            <main className="va-center">
                {/* Orb */}
                <div className={`va-orb-container ${agentState}`}>
                    <div className="va-orb-halo" />
                    <div className="va-orb">
                        <div className="va-orb-inner" />
                    </div>
                </div>

                {/* Status */}
                <div className="va-status">
                    <span className={`va-status-dot ${agentState}`} />
                    <span className="va-status-text">{statusLabel}</span>
                </div>

                {/* Transcript / Display */}
                <div className="va-transcript" key={turnCount}>
                    {agentState === 'listening' && transcript ? (
                        <p className="va-transcript-user">{transcript}</p>
                    ) : (
                        <p className="va-transcript-agent">{displayText || '\u00A0'}</p>
                    )}
                </div>

                {/* Clinical disclaimer */}
                {showDisclaimer && (
                    <div className="va-disclaimer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        This is a triage support tool only — not a medical diagnosis.
                    </div>
                )}
            </main>

            {/* ─── Bottom Controls ─── */}
            <footer className="va-controls">
                <button
                    className={`va-mic ${agentState === 'listening' ? 'active' : ''}`}
                    onClick={toggleMic}
                    disabled={agentState === 'speaking' || agentState === 'thinking'}
                    aria-label={agentState === 'listening' ? 'Stop listening' : 'Start listening'}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                        <path d="M19 10v2a7 7 0 01-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                    {agentState === 'listening' && <span className="va-mic-glow" />}
                </button>

                <button className="va-end" onClick={endSession}>End Session</button>
            </footer>

            {/* ─── Findings Panel ─── */}
            <div className={`va-panel-overlay ${showPanel ? 'open' : ''}`} onClick={() => setShowPanel(false)} />
            <aside className={`va-panel ${showPanel ? 'open' : ''}`}>
                <div className="va-panel-header">
                    <h3>Clinical Findings</h3>
                    <button className="va-panel-close" onClick={() => setShowPanel(false)} aria-label="Close panel">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="va-panel-content">
                    {/* Conversation Transcript */}
                    <div className="va-panel-section">
                        <h4>Patient Statements</h4>
                        {statements.length === 0 ? (
                            <p className="va-panel-empty">No statements recorded yet.</p>
                        ) : (
                            <ul className="va-panel-statements">
                                {statements.map((s, i) => (
                                    <li key={i}>
                                        <span className="va-stmt-num">{i + 1}</span>
                                        <span className="va-stmt-text">"{s}"</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Symptoms */}
                    <div className="va-panel-section">
                        <h4>Identified Symptoms</h4>
                        {symptoms.length === 0 ? (
                            <p className="va-panel-empty">No symptoms identified.</p>
                        ) : (
                            <div className="va-panel-pills">
                                {symptoms.map(s => (
                                    <span key={s} className="va-panel-pill">{s}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Severity */}
                    {detectedSeverity && (
                        <div className="va-panel-section">
                            <h4>Reported Severity</h4>
                            <div className={`va-panel-severity ${detectedSeverity}`}>
                                <span className="va-panel-severity-dot" />
                                {detectedSeverity.toUpperCase()}
                            </div>
                        </div>
                    )}

                    {/* Priority */}
                    {priority && (
                        <div className="va-panel-section">
                            <h4>Priority Assessment</h4>
                            <div className={`va-panel-priority ${priority.toLowerCase()}`}>
                                <span className="va-panel-priority-dot" />
                                {priority} PRIORITY
                            </div>
                        </div>
                    )}

                    {/* Department */}
                    {department && (
                        <div className="va-panel-section">
                            <h4>Suggested Department</h4>
                            <div className="va-panel-dept">{department}</div>
                        </div>
                    )}

                    {/* Session info footer */}
                    <div className="va-panel-section va-panel-footer-info">
                        <h4>Session Data</h4>
                        <div className="va-panel-meta">
                            <span>Exchanges: {statements.length}</span>
                            <span>Phase: {phase.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default VoiceAgent;
