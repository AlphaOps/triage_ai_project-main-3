import React from 'react';
import './VoiceMic.css';

/**
 * Premium voice microphone button.
 * 
 * Design: Minimalist circular button with soft borders,
 * gentle scale on hover, and a calm breathing glow when active.
 * Medical-grade, old-money aesthetic — no flashy visuals.
 * 
 * Always renders — if browser doesn't support speech recognition,
 * the button appears in a muted/disabled state with a tooltip.
 */
const VoiceMic = ({ isListening, isSupported, onToggle, size = 'default', className = '' }) => {
    const handleClick = () => {
        if (!isSupported) {
            // Silent — premium UX, no alerts
            return;
        }
        onToggle();
    };

    return (
        <div className={`voice-mic-wrapper ${size} ${className}`}>
            <button
                className={`voice-mic ${isListening ? 'listening' : ''} ${!isSupported ? 'unsupported' : ''}`}
                onClick={handleClick}
                type="button"
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                title={!isSupported ? 'Voice input not supported in this browser' : isListening ? 'Stop listening' : 'Voice input'}
            >
                {/* Glow ring — only visible when listening */}
                {isListening && <span className="voice-mic-glow" />}

                {/* Mic icon */}
                <svg
                    className="voice-mic-icon"
                    width={size === 'compact' ? 14 : 16}
                    height={size === 'compact' ? 14 : 16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
            </button>

            {/* "Listening…" label — fades in when active */}
            {isListening && (
                <span className="voice-mic-label">Listening…</span>
            )}
        </div>
    );
};

export default VoiceMic;
