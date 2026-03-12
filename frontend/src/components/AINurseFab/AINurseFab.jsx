import React from 'react';
import './AINurseFab.css';

/**
 * AI Nurse Floating Action Button.
 * Now triggers the immersive Voice Agent (Siri-like experience).
 */
const AINurseFab = ({ onClick }) => {
    return (
        <button
            className="ai-nurse-fab"
            onClick={onClick}
            aria-label="Open AI Nurse Voice Assistant"
        >
            <div className="ai-nurse-fab-glow"></div>
            <span className="ai-nurse-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
            </span>
            <span className="ai-nurse-label">Talk to AI Nurse</span>
        </button>
    );
};

export default AINurseFab;

