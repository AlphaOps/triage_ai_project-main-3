import React, { useState } from 'react';
import './PatientSignup.css';

const PatientSignup = ({ onSignup, onLoginLink, onBack }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        // Simulate signup success
        onSignup({ fullName, email });
    };

    return (
        <div className="ps-page">
            <button className="back-btn" onClick={onBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back
            </button>

            <div className="ps-left">
                <div className="ps-left-content">
                    <span className="ps-left-icon">✦</span>
                    <h2>SimpToms AI</h2>
                    <p>Join thousands of patients receiving faster, AI-powered care.</p>
                    <div className="ps-left-line"></div>
                    <span className="ps-left-tag">Create Account</span>
                </div>
            </div>

            <div className="ps-right">
                <div className="ps-card fade-in">
                    <h1>Create Account</h1>
                    <p className="ps-card-sub">Enter your details to get started</p>

                    {error && <div className="ps-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="ps-form">
                        <div className="form-field">
                            <label>Full Name</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Email Address</label>
                            <input
                                className="form-input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Password</label>
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Confirm Password</label>
                            <input
                                className="form-input"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-primary ps-submit">Sign Up</button>
                    </form>

                    <p className="ps-footer-text">Already have an account? <button className="ps-link-btn" onClick={onLoginLink}>Log in</button></p>
                </div>
            </div>
        </div>
    );
};

export default PatientSignup;
