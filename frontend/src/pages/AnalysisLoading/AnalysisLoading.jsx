import React, { useState, useEffect } from 'react';
import './AnalysisLoading.css';

const AnalysisLoading = ({ onComplete, isReady }) => {
    const [progress, setProgress] = useState(0);
    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        const t1 = setInterval(() => setProgress(p => (p >= 100 ? 100 : p + 1)), 40);
        const done = setTimeout(() => setAnimationDone(true), 4000);
        return () => { clearInterval(t1); clearTimeout(done); };
    }, []);

    // Auto-navigation removed to allow manual "View Details"


    return (
        <div className="al-screen">
            <div className="al-ambient-bg"></div>

            <div className="al-content">
                {/* ─── The Breathing Orb ─── */}
                <div className="al-orb-container">
                    <div className="al-orb-pulse-ring"></div>
                    <div className="al-orb-core"></div>
                </div>

                {/* ─── Text Content ─── */}
                <div className="al-text-group fade-up">
                    <h2 className="al-title">Analyzing your health data…</h2>
                    <p className="al-subtitle">Please wait while MediTriage evaluates your symptoms and vitals.</p>
                </div>
            </div>

            {/* ─── Bottom Actions (Apple-Style) ─── */}
            <div className="al-actions fade-up-delay">
                <button
                    className={`al-btn al-btn-primary ${!isReady ? 'disabled' : ''}`}
                    onClick={() => isReady && onComplete()}
                    disabled={!isReady}
                >
                    {isReady ? 'View Details' : 'Processing...'}
                </button>
                <button className="al-btn al-btn-secondary" onClick={() => window.location.reload()}>
                    Cancel Analysis
                </button>
            </div>
        </div>
    );
};

export default AnalysisLoading;
