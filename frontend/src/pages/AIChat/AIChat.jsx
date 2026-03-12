import React, { useState, useEffect, useRef } from 'react';
import './AIChat.css';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import VoiceMic from '../../components/VoiceMic/VoiceMic';

/* ─── Contextual Response Engine ─── */
const RESPONSE_PATTERNS = {
    greeting: [
        "Good day. I'm your AI Nurse Assistant. I can answer general health questions and provide guidance based on your assessment. How may I help you?",
    ],
    clarification: [
        "Could you tell me a bit more about when this started? Understanding the timeline helps me provide better guidance.",
        "I'd like to understand better — is this something that occurs intermittently, or has it been persistent?",
        "That's helpful to know. Have you noticed any other accompanying symptoms alongside this?",
        "Thank you for sharing. Does this tend to worsen at any particular time of day, or with certain activities?",
    ],
    reassurance: [
        "I understand your concern, and it's good that you're being attentive to your health. Many of these symptoms are common and manageable with proper care.",
        "It's perfectly natural to feel worried. Based on what you're describing, this sounds like something your physician can help with effectively.",
        "You're doing the right thing by seeking information. Most cases similar to yours respond well to timely medical attention.",
        "I want to reassure you that being proactive about your health is always the right approach. Let's work through this together.",
    ],
    guidance: [
        "Based on what you've described, I'd recommend scheduling a follow-up with your physician within the next few days. In the meantime, stay hydrated and rest.",
        "Given your symptoms, monitoring your vitals regularly would be beneficial. If anything changes significantly, please don't hesitate to seek immediate care.",
        "I'd suggest keeping a symptom diary for the next 48 hours — noting when symptoms appear, their intensity, and any triggers. This will be valuable for your doctor.",
        "While this doesn't appear to require emergency attention, I'd recommend using our 'Find a Doctor' feature to book a specialist consultation at your convenience.",
        "For now, over-the-counter management may help with comfort. However, if symptoms persist beyond 72 hours, a clinical evaluation is advisable.",
    ],
    pain: [
        "Pain can have many causes and it's important not to ignore it. Could you rate the intensity on a scale of 1 to 10?",
        "I hear you. Pain management is important for quality of life. Your physician can help determine the root cause and create an appropriate treatment plan.",
        "If the pain is sharp or sudden, please consider seeking immediate medical attention. For chronic or dull pain, scheduling a consultation would be appropriate.",
    ],
    medication: [
        "For medication-related questions, I always recommend consulting your prescribing physician. They have your complete medical history and can provide personalised advice.",
        "It's important never to adjust medication dosages without professional guidance. If you're experiencing side effects, your doctor can explore alternatives.",
        "You can use our Prescription Scanner feature to get a quick overview of your medications and potential interactions. Would you like to try that?",
    ],
    emergency: [
        "If you're experiencing severe symptoms such as chest pain, difficulty breathing, sudden numbness, or loss of consciousness, please call emergency services immediately.",
        "Your safety is our priority. If this feels like an emergency, please don't wait — contact emergency services or visit your nearest emergency department.",
    ],
    fallback: [
        "That's a thoughtful question. While I can provide general health guidance, I'd recommend discussing this specifically with your healthcare provider for personalised advice.",
        "I appreciate you asking. This is something that would benefit from a one-on-one clinical consultation. Would you like me to help you find a specialist?",
        "Thank you for bringing this up. For the most accurate and tailored advice, I'd encourage a follow-up with your physician who can review your complete history.",
    ],
};

function getResponse(userMsg) {
    const lower = userMsg.toLowerCase();

    // Emergency keywords
    if (/emergency|can't breathe|heart attack|stroke|unconscious|severe pain/i.test(lower)) {
        return pickRandom(RESPONSE_PATTERNS.emergency);
    }

    // Pain keywords
    if (/pain|hurt|ache|sore|sting|throb/i.test(lower)) {
        return pickRandom(RESPONSE_PATTERNS.pain);
    }

    // Medication keywords
    if (/medicine|medication|drug|pill|tablet|prescription|dosage|side effect/i.test(lower)) {
        return pickRandom(RESPONSE_PATTERNS.medication);
    }

    // Question patterns → clarification
    if (/what should|how long|is it normal|should i worry|is this serious|when to/i.test(lower)) {
        return pickRandom(RESPONSE_PATTERNS.guidance);
    }

    // Worried/anxious → reassurance
    if (/worried|scared|anxious|afraid|concern|nervous|panic/i.test(lower)) {
        return pickRandom(RESPONSE_PATTERNS.reassurance);
    }

    // Symptom mention → clarification
    if (/symptom|fever|cough|headache|dizzy|nausea|fatigue|rash|swelling/i.test(lower)) {
        return pickRandom(RESPONSE_PATTERNS.clarification);
    }

    // Short messages → clarification
    if (lower.split(' ').length < 4) {
        return pickRandom(RESPONSE_PATTERNS.clarification);
    }

    // Cycle through response types for variety
    const types = ['guidance', 'reassurance', 'clarification', 'fallback'];
    return pickRandom(RESPONSE_PATTERNS[types[Math.floor(Math.random() * types.length)]]);
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const QUICK_PROMPTS = [
    "What do my results mean?",
    "Should I be worried?",
    "When should I see a doctor?",
];

const AIChat = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: RESPONSE_PATTERNS.greeting[0], time: formatTime() }
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const endRef = useRef(null);
    const inputRef = useRef(null);

    // Voice input
    const { isListening, transcript, isSupported, toggle: toggleVoice } = useSpeechRecognition({
        onResult: (finalText) => {
            setInput(prev => {
                const combined = prev ? `${prev} ${finalText}` : finalText;
                return combined;
            });
            inputRef.current?.focus();
        }
    });

    // Show interim transcript in input
    useEffect(() => {
        if (isListening && transcript) {
            setInput(prev => {
                // Replace only the interim portion
                const base = prev.replace(/\s*\[.*\]$/, '');
                return base ? `${base} ${transcript}` : transcript;
            });
        }
    }, [transcript, isListening]);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);
    useEffect(() => { inputRef.current?.focus(); }, []);

    function formatTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    const send = (text) => {
        const msg = (text || input).trim();
        if (!msg) return;
        setMessages(prev => [...prev, { role: 'user', text: msg, time: formatTime() }]);
        setInput('');
        setTyping(true);

        // Simulate variable delay (800–1800ms) for natural feel
        const delay = 800 + Math.random() * 1000;
        setTimeout(() => {
            setTyping(false);
            setMessages(prev => [...prev, { role: 'ai', text: getResponse(msg), time: formatTime() }]);
        }, delay);
    };

    return (
        <div className="ch-overlay" onClick={onClose}>
            <div className="ch-container card" onClick={e => e.stopPropagation()}>
                <div className="ch-header">
                    <div className="ch-header-left">
                        <span className="ch-avatar">✦</span>
                        <div>
                            <h3>AI Nurse Assistant</h3>
                            <span className="ch-status">
                                <span className="ch-status-dot"></span>
                                Available
                            </span>
                        </div>
                    </div>
                    <button className="ch-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="ch-messages">
                    {messages.map((m, i) => (
                        <div key={i} className={`ch-bubble ${m.role} msg-enter`} style={{ animationDelay: `${i * 0.05}s` }}>
                            {m.role === 'ai' && <span className="ch-bubble-avatar">✦</span>}
                            <div>
                                <div className="ch-bubble-text">{m.text}</div>
                                <span className="ch-bubble-time">{m.time}</span>
                            </div>
                        </div>
                    ))}
                    {typing && (
                        <div className="ch-bubble ai msg-enter">
                            <span className="ch-bubble-avatar">✦</span>
                            <div className="ch-bubble-text ch-typing"><span></span><span></span><span></span></div>
                        </div>
                    )}
                    <div ref={endRef}></div>
                </div>

                {/* Quick Prompts */}
                {messages.length <= 2 && !typing && (
                    <div className="ch-quick-prompts">
                        {QUICK_PROMPTS.map((q, i) => (
                            <button key={i} className="ch-quick-btn" onClick={() => send(q)}>{q}</button>
                        ))}
                    </div>
                )}

                <div className={`ch-input-area ${isListening ? 'ch-input-listening' : ''}`}>
                    <input
                        ref={inputRef}
                        placeholder={isListening ? 'Speak now…' : 'Ask a health question...'}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                    />
                    <VoiceMic
                        isListening={isListening}
                        isSupported={isSupported}
                        onToggle={toggleVoice}
                        className="inline"
                    />
                    <button className="ch-send" onClick={() => send()} disabled={!input.trim()}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
