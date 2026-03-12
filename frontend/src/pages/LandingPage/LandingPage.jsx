import React from 'react';
import './LandingPage.css';
import ShowcaseSection from '../../components/ShowcaseSection/ShowcaseSection';
import PlatformShowcase from '../../components/PlatformShowcase/PlatformShowcase';
import heroImage from '../../assets/hero-hospital.png';

const LandingPage = ({ onPatientLogin, onStaffLogin }) => {
    return (
        <div className="lp-container">
            {/* ━━ Floating Navigation ━━ */}
            <nav className="lp-nav">
                <div className="grid-container lp-nav-inner">
                    <div className="lp-nav-brand">
                        <span className="lp-logo-icon">✦</span>
                        <span className="lp-logo-text">SimpToms AI</span>
                    </div>
                    <div className="lp-nav-actions">
                        <button className="lp-nav-link" onClick={onStaffLogin}>For Hospitals</button>
                        <button className="lp-nav-link" onClick={onPatientLogin}>Patient Portal</button>
                        <button className="lp-nav-cta" onClick={onPatientLogin}>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* ━━ Unified Hero Layer (Single Sticky Container) ━━ */}
            <div className="lp-hero-layer">
                {/* Background Image integrated directly here */}
                <div
                    className="lp-hero-bg-media"
                    style={{ backgroundImage: `url(${heroImage})` }}
                >
                    <div className="lp-hero-bg-overlay"></div>
                </div>

                <div className="grid-container lp-hero-container">
                    <div className="lp-hero-content-right fade-in">
                        <div className="lp-badge glass-badge">
                            <span className="lp-badge-dot"></span>
                            AI-Powered Clinical Intelligence
                        </div>

                        <h1 className="lp-title">
                            Intelligent Patient<br />Triage, Reimagined.
                        </h1>

                        <p className="lp-subtitle">
                            Explainable AI that prioritizes care, reduces delays, and supports clinical decisions — without replacing medical judgment.
                        </p>

                        <div className="lp-hero-btns">
                            <button className="btn-primary btn-apple-style" onClick={onPatientLogin}>
                                Get Started <span className="arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ━━ Content Layer (Slides Over Hero) ━━ */}
            <div className="lp-content-layer">
                {/* ━━ How It Works ━━ */}
                <section className="lp-section">
                    <div className="grid-container">
                        <span className="lp-section-tag fade-in">How It Works</span>
                        <h2 className="lp-section-title fade-in fade-in-delay-1">Three steps to prioritised care</h2>

                        <div className="lp-steps">
                            {[
                                { num: '01', title: 'Enter Symptoms', desc: 'Patients or staff input symptoms through a guided clinical interface.', delay: 'fade-in-delay-1' },
                                { num: '02', title: 'AI Risk Assessment', desc: 'Our model evaluates urgency with explainable confidence scores.', delay: 'fade-in-delay-2' },
                                { num: '03', title: 'Prioritised Care', desc: 'Patients are routed to the appropriate department based on risk level.', delay: 'fade-in-delay-3' },
                            ].map(s => (
                                <div key={s.num} className={`lp-step card fade-in ${s.delay}`}>
                                    <span className="lp-step-num">{s.num}</span>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ━━ Platform Intelligence Showcase ━━ */}
                <ShowcaseSection />

                {/* ━━ Interactive Platform Showcase ━━ */}
                <PlatformShowcase />

                {/* ━━ Safety / Ethics ━━ */}
                <section className="lp-section lp-safety-section">
                    <div className="lp-safety-content">
                        <span className="lp-section-tag fade-in">Safety & Ethics</span>
                        <h2 className="lp-section-title fade-in fade-in-delay-1">Designed with clinical responsibility</h2>

                        <div className="lp-safety-cards fade-in fade-in-delay-2">
                            {[
                                { title: 'No Diagnosis', desc: 'MediTriage performs urgency prioritisation only. It does not diagnose conditions or prescribe treatments.' },
                                { title: 'Decision Support', desc: 'All AI outputs serve as clinical decision support tools and must be reviewed by qualified medical professionals.' },
                                { title: 'Synthetic Data Only', desc: 'This demo platform operates entirely on synthetic data. No real patient information is collected or stored.' },
                                { title: 'Transparent AI', desc: 'Every risk assessment includes an explainability panel so clinicians understand the reasoning behind each score.' },
                            ].map((c, i) => (
                                <div key={i} className="lp-safety-card card">
                                    <div className="lp-safety-check">✓</div>
                                    <h4>{c.title}</h4>
                                    <p>{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ━━ Footer ━━ */}
                <footer className="lp-footer">
                    <div className="grid-container">
                        <div className="lp-footer-content">
                            <div className="lp-footer-brand">
                                <span className="lp-logo-text">SimpToms AI</span>
                                <p>Next-generation patient prioritisation.</p>
                            </div>
                            <div className="lp-footer-links">
                                <div className="lp-footer-col">
                                    <h4>Product</h4>
                                    <a href="#">Triage Engine</a>
                                    <a href="#">Analytics</a>
                                    <a href="#">Security</a>
                                </div>
                                <div className="lp-footer-col">
                                    <h4>Company</h4>
                                    <a href="#">About</a>
                                    <a href="#">Ethics</a>
                                    <a href="#">Contact</a>
                                </div>
                            </div>
                        </div>
                        <div className="lp-footer-bottom">
                            <p>© 2026 MediTriage. All rights reserved.</p>
                            <div className="lp-footer-legal">
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
