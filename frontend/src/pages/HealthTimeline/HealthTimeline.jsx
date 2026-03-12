import React from 'react';
import { motion } from 'framer-motion';
import './HealthTimeline.css';

const HEALTH_SCORE = 78;
const SCORE_HISTORY = [
    { month: 'Aug', score: 65 },
    { month: 'Sep', score: 68 },
    { month: 'Oct', score: 72 },
    { month: 'Nov', score: 70 },
    { month: 'Dec', score: 74 },
    { month: 'Jan', score: 76 },
    { month: 'Feb', score: 78 },
];

const TIMELINE = [
    { date: 'Feb 14, 2026', type: 'assessment', title: 'Triage Assessment — HIGH Priority', desc: 'Chest pain, elevated heart rate. Referred to Cardiology — Emergency.', risk: 'high', confidence: 87 },
    { date: 'Feb 10, 2026', type: 'prescription', title: 'Prescription Uploaded', desc: 'Amlodipine 5mg, Metformin 500mg, Atorvastatin 20mg, Aspirin 75mg detected. 1 minor interaction flagged.', risk: null },
    { date: 'Jan 28, 2026', type: 'appointment', title: 'Appointment — Dr. Sarah Mitchell', desc: 'Cardiology follow-up. ECG results normal. Blood pressure stable.', risk: null },
    { date: 'Jan 15, 2026', type: 'assessment', title: 'Triage Assessment — MEDIUM Priority', desc: 'Persistent headache with mild dizziness. Recommended neurology consultation.', risk: 'medium', confidence: 78 },
    { date: 'Dec 20, 2025', type: 'assessment', title: 'Triage Assessment — LOW Priority', desc: 'Seasonal flu symptoms. Over-the-counter medication recommended.', risk: 'low', confidence: 91 },
    { date: 'Dec 5, 2025', type: 'appointment', title: 'Appointment — Dr. Priya Sharma', desc: 'General health check-up. All vitals within normal range.', risk: null },
    { date: 'Nov 10, 2025', type: 'prescription', title: 'Prescription Updated', desc: 'Atorvastatin dosage increased from 10mg to 20mg based on cholesterol levels.', risk: null },
    { date: 'Oct 1, 2025', type: 'assessment', title: 'Triage Assessment — LOW Priority', desc: 'Routine fatigue check. Blood work recommended. No urgent findings.', risk: 'low', confidence: 85 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 20
        }
    }
};

const HealthTimeline = ({ onBack }) => {
    const scoreLevel = HEALTH_SCORE >= 80 ? 'Excellent' : HEALTH_SCORE >= 60 ? 'Good' : HEALTH_SCORE >= 40 ? 'Fair' : 'Needs Attention';
    const scoreColor = HEALTH_SCORE >= 80 ? '#10B981' : HEALTH_SCORE >= 60 ? '#F59E0B' : HEALTH_SCORE >= 40 ? '#F97316' : '#EF4444';
    const maxScore = Math.max(...SCORE_HISTORY.map(s => s.score));

    return (
        <motion.div
            className="ht-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* ── Navigation ── */}
            <nav className="ht-nav">
                <div className="grid-container ht-nav-inner">
                    <button className="ht-back-btn" onClick={onBack}>
                        <span className="icon">←</span> Dashboard
                    </button>
                    <div className="ht-brand">
                        <span className="logo">✦</span>
                        <span>SimpToms AI</span>
                    </div>
                </div>
            </nav>

            <div className="ht-content grid-container">
                {/* ── Header ── */}
                <motion.div
                    className="ht-header"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                >
                    <h1>Health Journey</h1>
                    <p>A comprehensive view of your assessments, vitals, and care history.</p>
                </motion.div>

                {/* ── Score & Stats Hero ── */}
                <motion.div
                    className="ht-hero-section"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Health Score Card */}
                    <motion.div className="ht-card ht-score-card glass-panel" variants={itemVariants}>
                        <div className="ht-card-header">
                            <h3>Current Health Score</h3>
                            <span className="ht-badge">Live Update</span>
                        </div>
                        <div className="ht-score-display">
                            <div className="ht-ring-wrapper">
                                <svg viewBox="0 0 120 120" className="ht-ring-svg">
                                    <circle cx="60" cy="60" r="52" className="ht-ring-bg" />
                                    <motion.circle
                                        cx="60" cy="60" r="52"
                                        className="ht-ring-progress"
                                        stroke={scoreColor}
                                        initial={{ strokeDasharray: "0 327" }}
                                        animate={{ strokeDasharray: `${(HEALTH_SCORE / 100) * 327} 327` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="ht-score-value">
                                    <span className="number">{HEALTH_SCORE}</span>
                                </div>
                            </div>
                            <div className="ht-score-meta">
                                <span className="level" style={{ color: scoreColor }}>{scoreLevel}</span>
                                <p>Based on recent vitals stability and medication adherence.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Trend Chart */}
                    <motion.div className="ht-card ht-chart-card glass-panel" variants={itemVariants}>
                        <div className="ht-card-header">
                            <h3>6-Month Trend</h3>
                            <span className="ht-trend-val positive">+13pts</span>
                        </div>
                        <div className="ht-chart-viz">
                            {SCORE_HISTORY.map((s, i) => (
                                <div key={i} className="ht-bar-group">
                                    <motion.div
                                        className="ht-bar"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(s.score / maxScore) * 100}%` }}
                                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                                    >
                                        <span className="ht-bar-tooltip">{s.score}</span>
                                    </motion.div>
                                    <span className="ht-bar-label">{s.month}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div className="ht-card ht-stats-card glass-panel" variants={itemVariants}>
                        <div className="ht-stat-item">
                            <span className="val">5</span>
                            <span className="lbl">Assessments</span>
                        </div>
                        <div className="ht-divider"></div>
                        <div className="ht-stat-item">
                            <span className="val">2</span>
                            <span className="lbl">Appointments</span>
                        </div>
                        <div className="ht-divider"></div>
                        <div className="ht-stat-item">
                            <span className="val">2</span>
                            <span className="lbl">Active Rx</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* ── Timeline Events ── */}
                <motion.div
                    className="ht-timeline-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <div className="ht-timeline-line"></div>

                    {TIMELINE.map((ev, i) => (
                        <motion.div
                            key={i}
                            className="ht-event-row"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div className="ht-event-marker">
                                <div className={`ht-dot ${ev.type}`}></div>
                            </div>
                            <div className="ht-event-body glass-panel-sm">
                                <div className="ht-event-header">
                                    <span className="date">{ev.date}</span>
                                    {ev.risk && <span className={`ht-risk-tag ${ev.risk}`}>{ev.risk.toUpperCase()}</span>}
                                </div>
                                <h4>{ev.title}</h4>
                                <p>{ev.desc}</p>
                                {ev.confidence && (
                                    <div className="ht-conf-bar-sm">
                                        <div className="fill" style={{ width: `${ev.confidence}%` }}></div>
                                        <span>AI Confidence: {ev.confidence}%</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </motion.div>
    );
};

export default HealthTimeline;
