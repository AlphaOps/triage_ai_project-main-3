import React, { useState, useRef, useEffect } from 'react';
import './PlatformShowcase.css';

const FEATURES = [
    {
        id: 0,
        word: 'prioritize',
        title: 'AI-Powered Patient Prioritization',
        desc: 'Instantly categorize patient urgency based on symptoms, vitals, and history.',
    },
    {
        id: 1,
        word: 'explain',
        title: 'Explainable Risk Assessment',
        desc: 'Every priority decision includes transparent contributing factors.',
    },
    {
        id: 2,
        word: 'monitor',
        title: 'Real-Time Triage Dashboard',
        desc: 'Hospitals view incoming patients sorted by clinical urgency.',
    },
    {
        id: 3,
        word: 'guide',
        title: 'AI-Nurse Guided Intake',
        desc: 'Patients provide structured information through natural conversation.',
    },
    {
        id: 4,
        word: 'analyze',
        title: 'Prescription & Data Insights',
        desc: 'Uploaded prescriptions converted into readable clinical context.',
    },
];

/* ═══════════════════════════════════════
   FRAME PANELS — CSS-rendered UI mockups
   ═══════════════════════════════════════ */

const PanelAssessment = () => (
    <div className="ps-panel">
        <div className="ps-panel-bar">
            <span className="ps-panel-bar-title">Patient Assessment</span>
            <span className="ps-panel-bar-badge">PT-4829</span>
        </div>
        <div className="ps-panel-steps">
            <span className="ps-pill done">Basic Info ✓</span>
            <span className="ps-pill active">Symptoms</span>
            <span className="ps-pill">Vitals</span>
            <span className="ps-pill">History</span>
        </div>
        <div className="ps-panel-body">
            <p className="ps-panel-lbl">Select your symptoms</p>
            <div className="ps-chips">
                {['Headache', 'Chest Pain', 'Fever', 'Dizziness', 'Nausea', 'Fatigue', 'Cough', 'Back Pain'].map((s, i) => (
                    <span key={s} className={`ps-chip ${[1, 3].includes(i) ? 'on' : ''}`}>{s}</span>
                ))}
            </div>
            <div className="ps-fields-row">
                <div className="ps-field"><span>Duration</span><div className="ps-field-box">3 days</div></div>
                <div className="ps-field"><span>Severity</span><div className="ps-field-box">Moderate</div></div>
            </div>
            <div className="ps-panel-actions">
                <button className="ps-btn-ghost">← Back</button>
                <button className="ps-btn-dark">Continue →</button>
            </div>
        </div>
    </div>
);

const PanelRisk = () => (
    <div className="ps-panel">
        <div className="ps-panel-bar">
            <span className="ps-panel-bar-title">Risk Assessment Result</span>
            <span className="ps-panel-bar-badge">PT-4829</span>
        </div>
        <div className="ps-panel-body">
            <div className="ps-risk-hero">
                <div className="ps-risk-circle">
                    <span className="ps-risk-lbl">HIGH</span>
                    <span className="ps-risk-val">87%</span>
                </div>
                <div className="ps-risk-info">
                    <h4>Elevated Priority</h4>
                    <p>Based on symptom severity, cardiac indicators, and vital signs patterns.</p>
                    <span className="ps-risk-dept">→ Cardiology</span>
                </div>
            </div>
            <p className="ps-panel-lbl" style={{ marginTop: '20px' }}>Contributing Factors</p>
            <div className="ps-factors">
                {[
                    { n: 'Chest Pain', p: 92 },
                    { n: 'Dizziness', p: 74 },
                    { n: 'Shortness of Breath', p: 68 },
                    { n: 'Age Risk Factor', p: 41 },
                ].map((f, i) => (
                    <div key={i} className="ps-factor-row">
                        <span className="ps-factor-name">{f.n}</span>
                        <div className="ps-factor-track"><div className="ps-factor-fill" style={{ width: `${f.p}%` }}></div></div>
                        <span className="ps-factor-pct">{f.p}%</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PanelDashboard = () => (
    <div className="ps-panel ps-panel-split">
        <div className="ps-sidebar">
            <div className="ps-sidebar-brand">✦ MediTriage</div>
            <nav className="ps-sidebar-menu">
                <div className="ps-sidebar-item active">☰ Patient Queue</div>
                <div className="ps-sidebar-item">📊 Analytics</div>
                <div className="ps-sidebar-item">⚙ Settings</div>
            </nav>
        </div>
        <div className="ps-dash-content">
            <div className="ps-panel-bar">
                <span className="ps-panel-bar-title">Priority Patient Queue</span>
                <span className="ps-panel-bar-badge">Dr. Admin</span>
            </div>
            <div className="ps-dash-kpis">
                <div className="ps-kpi"><strong>47</strong><span>Active Cases</span></div>
                <div className="ps-kpi"><strong>12m</strong><span>Avg Wait</span></div>
                <div className="ps-kpi"><strong>94%</strong><span>AI Accuracy</span></div>
                <div className="ps-kpi"><strong>8</strong><span>Critical</span></div>
            </div>
            <div className="ps-dash-table">
                <div className="ps-tbl-head"><span>Patient</span><span>Risk</span><span>Department</span><span>Score</span></div>
                {[
                    { n: 'Jameson, L.', r: 'HIGH', d: 'Cardiology', s: '98%' },
                    { n: 'Chen, M.', r: 'MEDIUM', d: 'Neurology', s: '85%' },
                    { n: 'Gupta, R.', r: 'LOW', d: 'General Med.', s: '62%' },
                    { n: 'Kowalski, A.', r: 'HIGH', d: 'Emergency', s: '94%' },
                    { n: 'Patel, S.', r: 'MEDIUM', d: 'Internal Med.', s: '78%' },
                ].map((row, i) => (
                    <div key={i} className="ps-tbl-row">
                        <span className="ps-tbl-name">{row.n}</span>
                        <span className={`ps-tbl-risk ${row.r.toLowerCase()}`}>{row.r}</span>
                        <span>{row.d}</span>
                        <span>{row.s}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PanelChat = () => (
    <div className="ps-panel ps-panel-chat">
        <div className="ps-panel-bar">
            <span className="ps-panel-bar-title">AI Nurse Assistant</span>
            <span className="ps-panel-bar-badge">Session Active</span>
        </div>
        <div className="ps-chat-msgs">
            <div className="ps-msg ps-msg-bot">
                <div className="ps-msg-ava">✦</div>
                <div className="ps-msg-bub">Hello, I'm your AI nurse assistant. I'll help gather your health information. Can you describe your main concern today?</div>
            </div>
            <div className="ps-msg ps-msg-user">
                <div className="ps-msg-bub ps-msg-bub-user">I've been having chest pain and dizziness for about 3 days now.</div>
            </div>
            <div className="ps-msg ps-msg-bot">
                <div className="ps-msg-ava">✦</div>
                <div className="ps-msg-bub">I understand. Let me ask a few follow-up questions. On a scale of 1-10, how would you rate the pain severity?</div>
            </div>
            <div className="ps-msg ps-msg-user">
                <div className="ps-msg-bub ps-msg-bub-user">About a 6. It gets worse when I climb stairs.</div>
            </div>
            <div className="ps-msg ps-msg-bot">
                <div className="ps-msg-ava">✦</div>
                <div className="ps-msg-bub">Thank you. Based on your symptoms, I'm compiling your intake summary for the clinical team.</div>
            </div>
        </div>
        <div className="ps-chat-bar">
            <span>Type your response…</span>
            <div className="ps-chat-send">→</div>
        </div>
    </div>
);

const PanelPrescription = () => (
    <div className="ps-panel">
        <div className="ps-panel-bar">
            <span className="ps-panel-bar-title">Prescription Analysis</span>
            <span className="ps-panel-bar-badge">Scan Complete</span>
        </div>
        <div className="ps-panel-body">
            <div className="ps-rx-file">
                <span className="ps-rx-file-icon">📄</span>
                <span className="ps-rx-file-name">prescription_scan.pdf</span>
                <span className="ps-rx-file-ok">✓ Processed</span>
            </div>
            <p className="ps-panel-lbl" style={{ marginTop: '24px' }}>Extracted Medications</p>
            {[
                { name: 'Amoxicillin 500mg', freq: '3× daily', dur: '7 days' },
                { name: 'Ibuprofen 200mg', freq: 'As needed', dur: '5 days' },
                { name: 'Omeprazole 20mg', freq: '1× daily', dur: '14 days' },
            ].map((m, i) => (
                <div key={i} className="ps-rx-med">
                    <div className="ps-rx-med-name">{m.name}</div>
                    <div className="ps-rx-med-meta"><span>{m.freq}</span><span>{m.dur}</span></div>
                </div>
            ))}
            <div className="ps-rx-alert">
                <span>⚠</span>
                <span>Interaction check: No known conflicts detected.</span>
            </div>
        </div>
    </div>
);

const PANELS = [PanelAssessment, PanelRisk, PanelDashboard, PanelChat, PanelPrescription];

const AUTO_CYCLE_DURATION = 3000; // 3 seconds per feature
const WORD_CYCLE_DURATION = 2000; // 2 seconds per headline word

/* ═══════════════════════
   MAIN COMPONENT
   ═══════════════════════ */
const PlatformShowcase = () => {
    const [active, setActive] = useState(0);
    const [wordIdx, setWordIdx] = useState(0); // Independent cycle for headline word
    const [displayed, setDisplayed] = useState(0);
    const [fading, setFading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const sectionRef = useRef(null);
    const timerRef = useRef(null);
    const wordTimerRef = useRef(null);

    // Observer for entry animation
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    const switchTo = (idx) => {
        if (idx === active || fading) return;
        setFading(true);
        setActive(idx);
        setProgress(0);

        setTimeout(() => {
            setDisplayed(idx);
            setTimeout(() => setFading(false), 50);
        }, 300);
    };

    // Auto-cycling feature + progress logic
    useEffect(() => {
        if (!visible || isPaused) return;

        const startTime = Date.now() - (progress / 100 * AUTO_CYCLE_DURATION);

        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / AUTO_CYCLE_DURATION) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                clearInterval(timerRef.current);
                switchTo((active + 1) % FEATURES.length);
            }
        }, 50);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [active, visible, isPaused]);

    // Independent word cycling (Continuous 2s)
    useEffect(() => {
        if (!visible) return;

        wordTimerRef.current = setInterval(() => {
            setWordIdx(prev => (prev + 1) % FEATURES.length);
        }, WORD_CYCLE_DURATION);

        return () => {
            if (wordTimerRef.current) clearInterval(wordTimerRef.current);
        };
    }, [visible]);

    const handleManualSwitch = (idx) => {
        if (timerRef.current) clearInterval(timerRef.current);
        switchTo(idx);
    };

    const Panel = PANELS[displayed];

    return (
        <section className={`ps ${visible ? 'ps--visible' : ''}`} ref={sectionRef}>
            <div className="ps__wrap">

                {/* ── LEFT ── */}
                <div className="ps__left">
                    <span className="ps__tag">PLATFORM INTELLIGENCE</span>

                    <h2 className="ps__h2">
                        How MediTriage<br />
                        helps clinicians<br />
                        <span className="ps__h2-word" key={wordIdx}>{FEATURES[wordIdx].word}</span>
                    </h2>

                    <p className="ps__desc">
                        Designed to assist hospitals with prioritization, clarity, and patient flow — not replace doctors.
                    </p>

                    <button className="ps__cta">Explore the platform</button>

                    {/* Feature list */}
                    <div className="ps__list">
                        {FEATURES.map((f, i) => (
                            <div
                                key={f.id}
                                className={`ps__item ${active === i ? 'ps__item--on' : ''}`}
                                onClick={() => handleManualSwitch(i)}
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                <div className="ps__item-row">
                                    <span className="ps__item-title">{f.title}</span>
                                    <span className="ps__item-num">{String(i + 1).padStart(2, '0')}</span>
                                </div>

                                {active === i && (
                                    <div className="ps__item-content">
                                        <p className="ps__item-desc">{f.desc}</p>
                                        <div className="ps__progress-track">
                                            <div
                                                className="ps__progress-fill"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT: Dark frame (NOT a tablet) ── */}
                <div className="ps__right">
                    <div className="ps__frame">
                        <div className={`ps__frame-inner ${fading ? 'ps__frame--out' : 'ps__frame--in'}`}>
                            <Panel />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default PlatformShowcase;
