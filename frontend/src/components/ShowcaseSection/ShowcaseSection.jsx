import React, { useRef, useEffect, useState } from 'react';
import './ShowcaseSection.css';

const ShowcaseSection = () => {
    const sectionRef = useRef(null);
    const tabletAreaRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [tabletInView, setTabletInView] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        const tabletArea = tabletAreaRef.current;
        if (!section || !tabletArea) return;

        // Fade-in observer for top content
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.05 }
        );
        observer.observe(section);

        // Tablet visibility observer
        const tabletObserver = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setTabletInView(true); },
            { threshold: 0.15 }
        );
        tabletObserver.observe(tabletArea);

        // Scroll-driven horizontal animation for tablet content
        const handleScroll = () => {
            const rect = tabletArea.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            // Progress: 0 when tablet top enters viewport bottom, 1 when tablet bottom leaves viewport top
            const start = viewportHeight;
            const end = -tabletArea.offsetHeight;
            const current = rect.top;
            const progress = Math.max(0, Math.min(1, (start - current) / (start - end)));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            observer.disconnect();
            tabletObserver.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Smooth horizontal slide: panel 1 visible at 0%, panel 2 at 100%
    const translateX = -(scrollProgress * 50);

    return (
        <section className="sc-section" ref={sectionRef}>

            {/* ═══ TOP: Split Layout (Headline Left, Cards Right) ═══ */}
            <div className={`sc-top-split ${isVisible ? 'sc-animate' : ''}`}>
                <div className="sc-top-left">
                    <span className="sc-label">PLATFORM INTELLIGENCE</span>
                    <h2 className="sc-headline">
                        Designed for safe,{' '}
                        <span className="sc-headline-accent">intelligent</span>{' '}
                        patient prioritization
                    </h2>
                </div>
                <div className="sc-top-right">
                    {[
                        {
                            icon: (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            ),
                            title: 'Structured symptom intake',
                            desc: 'Guided clinical questioning instead of chaotic free text.'
                        },
                        {
                            icon: (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            ),
                            title: 'Explainable risk assessment',
                            desc: 'Transparent Low / Medium / High priority logic.'
                        },
                        {
                            icon: (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                            title: 'Iterate on clinical protocols',
                            desc: 'Implement new triage logic with no wait time, no retraining.'
                        },
                        {
                            icon: (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ),
                            title: 'Clinical workflow support',
                            desc: 'Built for both patients and hospital care teams.'
                        }
                    ].map((card, i) => (
                        <div className="sc-feature-card" key={i}>
                            <div className="sc-feature-icon">{card.icon}</div>
                            <div className="sc-feature-text">
                                <h4>{card.title}</h4>
                                <p>{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══ TABLET: Full-Width Dark Background ═══ */}
            <div className={`sc-tablet-wrapper ${tabletInView ? 'sc-tablet-animate' : ''}`} ref={tabletAreaRef}>
                <div className="sc-tablet-bg">
                    <div className="sc-tablet-device">
                        {/* Bezel Top */}
                        <div className="sc-bezel-top">
                            <div className="sc-bezel-camera"></div>
                        </div>

                        {/* Screen */}
                        <div className="sc-screen">
                            <div
                                className="sc-track"
                                style={{ transform: `translateX(${translateX}%)` }}
                            >
                                {/* ──── Panel 1: Patient Assessment ──── */}
                                <div className="sc-slide">
                                    <div className="sc-ui-panel">
                                        <div className="sc-ui-sidebar">
                                            <div className="sc-ui-sidebar-logo">✦ MediTriage</div>
                                            <div className="sc-ui-sidebar-nav">
                                                <div className="sc-ui-nav-item active">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" /></svg>
                                                    Dashboard
                                                </div>
                                                <div className="sc-ui-nav-item">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                    Assessment
                                                </div>
                                                <div className="sc-ui-nav-item">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                                    AI Nurse
                                                </div>
                                                <div className="sc-ui-nav-item">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    Find Doctors
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sc-ui-main">
                                            <div className="sc-ui-topbar">
                                                <h3>Patient Assessment</h3>
                                                <span className="sc-ui-user-badge">PT-4829</span>
                                            </div>
                                            <div className="sc-ui-stepper-bar">
                                                <div className="sc-ui-step-pill done">Basic Info ✓</div>
                                                <div className="sc-ui-step-pill active">Symptoms</div>
                                                <div className="sc-ui-step-pill">Vitals</div>
                                                <div className="sc-ui-step-pill">History</div>
                                            </div>
                                            <div className="sc-ui-form-area">
                                                <p className="sc-ui-form-label">Select your symptoms</p>
                                                <div className="sc-ui-chips">
                                                    {['Headache', 'Chest Pain', 'Fever', 'Dizziness', 'Nausea', 'Fatigue', 'Cough', 'Back Pain', 'Shortness of Breath'].map((s, i) => (
                                                        <span key={s} className={`sc-ui-chip ${[1, 3, 8].includes(i) ? 'selected' : ''}`}>{s}</span>
                                                    ))}
                                                </div>
                                                <div className="sc-ui-input-grid">
                                                    <div className="sc-ui-field">
                                                        <span>Duration</span>
                                                        <div className="sc-ui-field-val">3 days</div>
                                                    </div>
                                                    <div className="sc-ui-field">
                                                        <span>Severity</span>
                                                        <div className="sc-ui-field-val">Moderate</div>
                                                    </div>
                                                </div>
                                                <div className="sc-ui-btn-row">
                                                    <button className="sc-ui-btn-back">← Back</button>
                                                    <button className="sc-ui-btn-next">Continue →</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ──── Panel 2: Hospital Dashboard ──── */}
                                <div className="sc-slide">
                                    <div className="sc-ui-panel">
                                        <div className="sc-ui-sidebar hospital">
                                            <div className="sc-ui-sidebar-logo">✦ MediTriage</div>
                                            <div className="sc-ui-sidebar-nav">
                                                <div className="sc-ui-nav-item active">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                                    Patient Queue
                                                </div>
                                                <div className="sc-ui-nav-item">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                    Analytics
                                                </div>
                                                <div className="sc-ui-nav-item">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    Settings
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sc-ui-main">
                                            <div className="sc-ui-topbar">
                                                <h3>Priority Patient Queue</h3>
                                                <span className="sc-ui-user-badge">Dr. Admin</span>
                                            </div>
                                            <div className="sc-ui-stats-bar">
                                                <div className="sc-ui-stat"><strong>47</strong><span>Active Cases</span></div>
                                                <div className="sc-ui-stat"><strong>12m</strong><span>Avg Wait</span></div>
                                                <div className="sc-ui-stat"><strong>94%</strong><span>AI Accuracy</span></div>
                                                <div className="sc-ui-stat"><strong>8</strong><span>Critical</span></div>
                                            </div>
                                            <div className="sc-ui-table">
                                                <div className="sc-ui-table-head">
                                                    <span>Patient</span>
                                                    <span>Risk Level</span>
                                                    <span>Department</span>
                                                    <span>Confidence</span>
                                                    <span></span>
                                                </div>
                                                {[
                                                    { name: 'Jameson, L.', risk: 'HIGH', dept: 'Cardiology', conf: '98%' },
                                                    { name: 'Chen, M.', risk: 'MEDIUM', dept: 'Neurology', conf: '85%' },
                                                    { name: 'Gupta, R.', risk: 'LOW', dept: 'General Med.', conf: '62%' },
                                                    { name: 'Kowalski, A.', risk: 'HIGH', dept: 'Emergency', conf: '94%' },
                                                    { name: 'Patel, S.', risk: 'MEDIUM', dept: 'Internal Med.', conf: '78%' },
                                                ].map((r, i) => (
                                                    <div key={i} className="sc-ui-table-row">
                                                        <span className="sc-ui-patient-name">{r.name}</span>
                                                        <span className={`sc-ui-risk-badge ${r.risk.toLowerCase()}`}>{r.risk}</span>
                                                        <span>{r.dept}</span>
                                                        <span>{r.conf}</span>
                                                        <span className="sc-ui-action-dots">···</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
