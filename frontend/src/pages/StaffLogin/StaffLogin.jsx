import React, { useState } from 'react';
import './StaffLogin.css';

const DEPARTMENTS = ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'ICU', 'Radiology', 'General Medicine'];

const StaffLogin = ({ onLogin, onBack }) => {
    const [mode, setMode] = useState('login');
    const [regStep, setRegStep] = useState(0);
    const [form, setForm] = useState({ name: '', email: '', password: '', hospitalName: '', hospitalCode: '', phone: '', departments: [] });
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const toggleDept = d => set('departments', form.departments.includes(d) ? form.departments.filter(x => x !== d) : [...form.departments, d]);

    if (mode === 'register') {
        const steps = ['Hospital Details', 'Contact', 'Departments', 'Security'];
        return (
            <div className="sl-page">
                <button className="back-btn" onClick={() => regStep > 0 ? setRegStep(regStep - 1) : setMode('login')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    {regStep === 0 ? 'Back to Login' : 'Previous'}
                </button>
                <div className="sl-reg">
                    <div className="sl-reg-header fade-in">
                        <span className="sl-reg-tag">Hospital Onboarding</span>
                        <h1>Register your facility</h1>
                    </div>
                    <div className="sl-progress fade-in fade-in-delay-1">
                        {steps.map((s, i) => (
                            <div key={i} className={`sl-prog-step ${i <= regStep ? 'active' : ''} ${i === regStep ? 'current' : ''}`}>
                                <div className="sl-prog-dot">{i < regStep ? '✓' : i + 1}</div>
                                <span>{s}</span>
                            </div>
                        ))}
                    </div>

                    <div className="sl-reg-card card fade-in fade-in-delay-2" key={regStep}>
                        {regStep === 0 && (
                            <div className="sl-fields">
                                <div className="form-field"><label>Hospital Name</label><input className="form-input" placeholder="Metropolitan General Hospital" value={form.hospitalName} onChange={e => set('hospitalName', e.target.value)} /></div>
                                <div className="form-field"><label>Hospital Code</label><input className="form-input" placeholder="MGH-001" value={form.hospitalCode} onChange={e => set('hospitalCode', e.target.value)} /></div>
                            </div>
                        )}
                        {regStep === 1 && (
                            <div className="sl-fields">
                                <div className="form-field"><label>Contact Name</label><input className="form-input" placeholder="Dr. Sarah Chen" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                                <div className="form-field"><label>Email</label><input className="form-input" type="email" placeholder="admin@hospital.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                                <div className="form-field"><label>Phone</label><input className="form-input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
                            </div>
                        )}
                        {regStep === 2 && (
                            <div className="sl-fields">
                                <p className="sl-dept-hint">Select all departments available at your facility</p>
                                <div className="sl-dept-grid">
                                    {DEPARTMENTS.map(d => (
                                        <button key={d} className={`as-pill ${form.departments.includes(d) ? 'active' : ''}`} onClick={() => toggleDept(d)}>{d}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {regStep === 3 && (
                            <div className="sl-fields">
                                <div className="form-field"><label>Password</label><input className="form-input" type="password" placeholder="Create a secure password" value={form.password} onChange={e => set('password', e.target.value)} /></div>
                                <div className="form-field"><label>Confirm Password</label><input className="form-input" type="password" placeholder="Confirm password" /></div>
                                <p className="sl-security-note">By registering, you agree to use this platform for clinical decision-support purposes only. All data is synthetic for demonstration.</p>
                            </div>
                        )}
                        <div className="sl-reg-footer">
                            <span className="sl-step-label">Step {regStep + 1} of 4</span>
                            <button className="btn-primary" onClick={() => regStep < 3 ? setRegStep(regStep + 1) : onLogin()}>
                                {regStep === 3 ? 'Complete Registration' : 'Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sl-page">
            <button className="back-btn" onClick={onBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back
            </button>
            <div className="sl-left">
                <div className="sl-left-content">
                    <span className="sl-left-icon">✦</span>
                    <h2>SimpToms AI</h2>
                    <p>Enterprise-grade clinical decision support for hospitals.</p>
                    <div className="sl-left-line"></div>
                    <span className="sl-left-tag">Staff Portal</span>
                </div>
            </div>
            <div className="sl-right">
                <div className="sl-card fade-in">
                    <div className="sl-secure-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                        <span>Secure Access</span>
                    </div>
                    <h1>Staff Login</h1>
                    <p className="sl-card-sub">Sign in to the hospital dashboard</p>
                    <form onSubmit={e => { e.preventDefault(); onLogin(); }} className="sl-form">
                        <div className="form-field"><label>Email</label><input className="form-input" type="email" placeholder="staff@hospital.com" /></div>
                        <div className="form-field"><label>Password</label><input className="form-input" type="password" placeholder="Enter password" /></div>
                        <button type="submit" className="btn-primary sl-submit">Sign In</button>
                    </form>
                    <p className="sl-footer-text">New hospital? <button className="sl-reg-link" onClick={() => setMode('register')}>Register your facility</button></p>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
