import React, { useState } from 'react';
import './PatientLogin.css';

const PatientLogin = ({ onLogin, onSignupLink, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="pl-page">
            <button className="back-btn" onClick={onBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back
            </button>

            <div className="pl-left">
                <div className="pl-left-content">
                    <span className="pl-left-icon">✦</span>
                    <h2>SimpToms AI</h2>
                    <p>AI-powered urgency assessment for faster, smarter care.</p>
                    <div className="pl-left-line"></div>
                    <span className="pl-left-tag">Patient Portal</span>
                </div>
            </div>

            <div className="pl-right">
                <div className="pl-card fade-in">
                    <h1>Welcome back</h1>
                    <p className="pl-card-sub">Sign in to access your health dashboard</p>

                    <form onSubmit={e => { e.preventDefault(); onLogin(); }} className="pl-form">
                        <div className="form-field">
                            <label>Email Address</label>
                            <input className="form-input" type="email" placeholder="you@example.com"
                                value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="form-field">
                            <label>Password</label>
                            <input className="form-input" type="password" placeholder="Enter your password"
                                value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary pl-submit">Continue</button>
                    </form>

                    <p className="pl-footer-text">Don't have an account? <button onClick={onSignupLink} className="pl-link-btn">Create one</button></p>
                </div>
            </div>
        </div>
    );
};

export default PatientLogin;
