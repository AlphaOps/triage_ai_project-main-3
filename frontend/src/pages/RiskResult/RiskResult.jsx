import React, { useEffect, useState } from 'react';
import './RiskResult.css';

const DEFAULT_RESULT = {
    risk: 'MEDIUM',
    confidence: 82,
    dept: 'General Medicine',
    action: 'Clinical assessment recommended within 4 hours.',
    explanation: 'Patient presentation indicates moderate urgency. Several indicators align with potential viral infection, though severe complications are currently unlikely.',
    factors: ['Fever > 100°F', 'Persistent Cough', 'Fatigue'],
    vitals: { hr: '72', bp: '120/80', temp: '98.6' }, // Simplified for display
    symptoms: ['Fever', 'Cough', 'Fatigue', 'Headache'],
};

const RiskResult = ({ result, onBack, onChat, onDoctorSearch, onNewAssessment }) => {
    const r = result || DEFAULT_RESULT;
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const risk = r.risk || 'LOW';
    const confidence = r.confidence || 70;
    const riskClass = risk.toLowerCase();

    return (
        <div className={`rr-page ${animate ? 'animate-in' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="rr-container">

                {/* ─── 1. Hero Status Card ─── */}
                <div className="rr-hero card-premium" style={{ position: 'relative', transition: 'all 0.6s ease' }}>
                    <div className="rr-hero-content">
                        <div className="rr-hero-header">
                            <span className="rr-label">Clinical Analysis</span>
                            <span className="rr-timestamp">Just now</span>
                        </div>
                        <h1 className="rr-title">Risk Assessment</h1>
                        <div className="rr-status-display">
                            <div className={`rr-status-badge ${riskClass}`}>
                                <div className="rr-status-dot"></div>
                                {risk} PRIORITY
                            </div>
                        </div>
                        <p className="rr-hero-desc">
                            Based on the symptoms and vitals provided, the AI model suggests this case requires <b>{risk === 'HIGH' ? 'urgent' : risk === 'MEDIUM' ? 'timely' : 'routine'} monitoring</b>.
                        </p>
                    </div>
                    {/* Visual Ring Decoration */}
                    <div className="rr-hero-visual">
                        <div className={`rr-ring ${riskClass}`}></div>
                    </div>
                </div>

                {/* ─── 2. Split Insight Grid ─── */}
                <div className="rr-grid">
                    {/* Left: AI Insight */}
                    <div className="rr-panel card-premium">
                        <div className="rr-panel-header">
                            <span className="icon">🧠</span>
                            <h3>AI Clinical Insight</h3>
                        </div>
                        <div className="rr-content">
                            <div className="rr-factors-box">
                                <label>Contributing Factors</label>
                                <div className="rr-tags">
                                    {(r.factors || []).map((f, i) => (
                                        <span key={i} className="rr-tag">{f.split('–')[0].trim()}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="rr-symptoms-list">
                                <label>Reported Symptoms</label>
                                <div className="rr-tags">
                                    {(r.symptoms || []).map((s, i) => (
                                        <span key={i} className="rr-tag">{s}</span>
                                    ))}
                                </div>
                            </div>

                            {/* New AI Reasoning Section */}
                            <div className="rr-reasoning-box" style={{ marginTop: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '0.85rem', letterSpacing: '0.05em', fontWeight: '600' }}>
                                    <span>🤖</span> RESPONSIBLE REASONS
                                </label>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--ink-light)', background: 'rgba(var(--primary-rgb), 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(var(--primary-rgb), 0.1)' }}>
                                    {r.explanation}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Recommendation */}
                    <div className="rr-panel card-premium">
                        <div className="rr-panel-header">
                            <span className="icon">🏥</span>
                            <h3>Recommended Care</h3>
                        </div>
                        <div className="rr-content">
                            <div className="rr-recommendation">
                                <label>Suggested Department</label>
                                <div className="rr-dept-pill">{r.dept}</div>
                            </div>
                            <div className="rr-action-box">
                                <label>Action Plan</label>
                                <p className="rr-text">{r.action}</p>
                            </div>
                            <div className="rr-vitals-preview">
                                <label>Vital Signs Reviewed</label>
                                <div className="rr-vitals-row">
                                    <div className="rr-vital-mini"><span>HR</span><strong>{r.vitals?.hr || '--'}</strong></div>
                                    <div className="rr-vital-mini"><span>BP</span><strong>{r.vitals?.bp || '--'}</strong></div>
                                    <div className="rr-vital-mini"><span>Temp</span><strong>{r.vitals?.temp || '--'}</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 3. Confidence & Transparency ─── */}
                <div className="rr-confidence-strip card-premium">
                    <div className="rr-conf-info">
                        <div className="rr-conf-label">AI Confidence Score</div>
                        <div className="rr-conf-bar-bg">
                            <div className="rr-conf-bar-fill" style={{ width: animate ? `${confidence}%` : '0%', background: 'var(--ink)' }}></div>
                        </div>
                    </div>
                    <div className="rr-conf-value">{confidence}%</div>
                </div>

                <p className="rr-disclaimer">
                    This is a clinical decision support tool. All results must be reviewed by a qualified medical professional.
                </p>

            </div>

            {/* ─── 4. Action Bar (Pill style) ─── */}
            <div className="rr-actions-bar">
                <button className="btn-text" onClick={onBack}>← Dashboard</button>
                <div className="rr-actions-right">
                    <button className="btn-glass" onClick={onChat}>Ask AI Nurse</button>
                    <button className="btn-glass" onClick={onDoctorSearch}>Find a Doctor</button>
                    <button className="btn-primary-glow" onClick={onNewAssessment}>New Assessment</button>
                </div>
            </div>
        </div>
    );
};

export default RiskResult;
