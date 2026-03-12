import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HospitalDashboard.css';

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA & UTILS — INDIAN CONTEXT
   ═══════════════════════════════════════════════════════════════════ */

const INITIAL_PATIENTS = [
    { id: 1, name: 'Rajesh Khanna', age: 67, gender: 'M', risk: 'HIGH', dept: 'Cardiology', doctor: 'Dr. S. Mukherjee', admitted: Date.now() - 1000 * 60 * 3, confidence: 91, symptoms: ['Chest Pain', 'Shortness of Breath', 'Palpitations'], action: 'Immediate ECG and cardiac enzymes panel', vitals: { hr: 102, bp_sys: 148, bp_dia: 92, temp: 98.8, spo2: 96 }, status: 'pending' },
    { id: 2, name: 'Sneha Patel', age: 34, gender: 'F', risk: 'MEDIUM', dept: 'Neurology', doctor: 'Dr. J. Wala', admitted: Date.now() - 1000 * 60 * 12, confidence: 78, symptoms: ['Severe Headache', 'Blurred Vision'], action: 'CT scan recommended within 2 hours', vitals: { hr: 88, bp_sys: 130, bp_dia: 85, temp: 99.1, spo2: 98 }, status: 'pending' },
    { id: 3, name: 'Manav Gupta', age: 8, gender: 'M', risk: 'LOW', dept: 'Pediatrics', doctor: 'Dr. E. Rao', admitted: Date.now() - 1000 * 60 * 18, confidence: 85, symptoms: ['Fever', 'Cough'], action: 'Monitor vitals, over-the-counter antipyretics', vitals: { hr: 110, bp_sys: 95, bp_dia: 60, temp: 101.2, spo2: 97 }, status: 'pending' },
    { id: 4, name: 'Indira Iyer', age: 72, gender: 'F', risk: 'HIGH', dept: 'Emergency', doctor: 'Dr. A. Khan', admitted: Date.now() - 1000 * 60 * 5, confidence: 94, symptoms: ['Abdominal Pain', 'Nausea', 'Fever'], action: 'Emergency surgical consultation', vitals: { hr: 96, bp_sys: 140, bp_dia: 88, temp: 100.4, spo2: 95 }, status: 'pending' },
    { id: 5, name: 'Jatin Shah', age: 45, gender: 'M', risk: 'MEDIUM', dept: 'Orthopedics', doctor: 'Dr. R. Chopra', admitted: Date.now() - 1000 * 60 * 28, confidence: 72, symptoms: ['Back Pain', 'Numbness'], action: 'X-ray and physiotherapy referral', vitals: { hr: 76, bp_sys: 125, bp_dia: 80, temp: 98.6, spo2: 99 }, status: 'pending' },
    { id: 6, name: 'Meera Reddy', age: 29, gender: 'F', risk: 'LOW', dept: 'General Medicine', doctor: 'Dr. P. Sharma', admitted: Date.now() - 1000 * 60 * 45, confidence: 88, symptoms: ['Fatigue', 'Loss of Appetite'], action: 'Blood work, follow-up in one week', vitals: { hr: 72, bp_sys: 118, bp_dia: 76, temp: 98.4, spo2: 99 }, status: 'pending' },
    { id: 7, name: 'Hema Singh', age: 58, gender: 'F', risk: 'HIGH', dept: 'Cardiology', doctor: 'Dr. S. Mukherjee', admitted: Date.now() - 1000 * 60 * 8, confidence: 89, symptoms: ['Chest Tightness', 'Dizziness', 'Sweating'], action: 'Urgent cardiac monitoring and troponin test', vitals: { hr: 98, bp_sys: 155, bp_dia: 95, temp: 98.7, spo2: 94 }, status: 'pending' },
    { id: 8, name: 'Taranjit Singh', age: 41, gender: 'M', risk: 'LOW', dept: 'General Medicine', doctor: 'Dr. P. Sharma', admitted: Date.now() - 1000 * 60 * 52, confidence: 82, symptoms: ['Mild Cough', 'Sore Throat'], action: 'Symptomatic treatment, follow up if worsening', vitals: { hr: 70, bp_sys: 120, bp_dia: 78, temp: 99.0, spo2: 98 }, status: 'pending' },
];

const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const DOCTORS_LIST = [...new Set(INITIAL_PATIENTS.map(p => p.doctor))];

const formatTimeAgo = (timestamp) => {
    const diff = Math.floor((Date.now() - timestamp) / 60000); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    const hrs = Math.floor(diff / 60);
    return `${hrs}h ${diff % 60}m ago`;
};

/* ═══════════════════════════════════════════════════════════════════
   HOSPITAL DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const HospitalDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('queue');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState(INITIAL_PATIENTS);
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterDoctor, setFilterDoctor] = useState('All');
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [toast, setToast] = useState(null);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    /* ─── Real-time simulation (Time & Vitals) ─── */
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
            // Randomly fluctuate vitals slightly for "live" feel
            setPatients(prev => prev.map(p => {
                if (Math.random() > 0.7) { // 30% chance to update each tick
                    return {
                        ...p,
                        vitals: {
                            ...p.vitals,
                            hr: p.vitals.hr + (Math.random() > 0.5 ? 1 : -1),
                            spo2: Math.min(100, Math.max(90, p.vitals.spo2 + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
                        }
                    };
                }
                return p;
            }));
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const handleAction = (id, actionType) => {
        const names = { accept: 'Accepted', escalate: 'Escalated', reviewed: 'Marked as Reviewed' };
        setPatients(prev => prev.map(p => p.id === id ? { ...p, status: actionType } : p));
        showToast(`Patient ${names[actionType]} successfully.`);
        setSelectedPatient(null);
    };

    /* ─── Filtering & Sorting ─── */
    const filteredPatients = patients
        .filter(p => filterDoctor === 'All' || p.doctor === filterDoctor)
        .filter(p => filterPriority === 'All' || p.risk === filterPriority)
        .sort((a, b) => {
            // Sort by priority first, then by wait time (descending)
            if (PRIORITY_ORDER[a.risk] !== PRIORITY_ORDER[b.risk]) return PRIORITY_ORDER[a.risk] - PRIORITY_ORDER[b.risk];
            return a.admitted - b.admitted;
        });

    const queuePatients = filteredPatients.filter(p => p.status === 'pending');
    const processedPatients = patients.filter(p => p.status !== 'pending');

    const highRiskCount = patients.filter(p => p.risk === 'HIGH' && p.status === 'pending').length;

    /* ─── Render Helpers ─── */
    const renderVital = (label, value, unit, isWarning) => (
        <div className={`hd-vital-card ${isWarning ? 'warning' : ''}`}>
            <span className="hd-vital-label">{label}</span>
            <div className="hd-vital-val-group">
                <span className="hd-vital-value">{value}</span>
                <span className="hd-vital-unit">{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="hd-layout">
            {/* ─── Glassmorphic Sidebar ─── */}
            <aside className={`hd-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="hd-sidebar-header">
                    <div className="hd-brand">
                        <span className="hd-logo">✦</span>
                        {!isSidebarCollapsed && <span className="hd-brand-text">SimpToms AI Professional</span>}
                    </div>
                </div>

                <nav className="hd-nav">
                    {[
                        { id: 'queue', icon: '📋', label: 'Live Queue' },
                        { id: 'doctors', icon: '👨‍⚕️', label: 'Provider View' },
                        { id: 'analytics', icon: '📊', label: 'Analytics' },
                        { id: 'settings', icon: '⚙️', label: 'Settings' },
                    ].map(item => (
                        <button
                            key={item.id}
                            className={`hd-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            title={isSidebarCollapsed ? item.label : ''}
                        >
                            <span className="hd-nav-icon">{item.icon}</span>
                            {!isSidebarCollapsed && <span className="hd-nav-label">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="hd-sidebar-footer">
                    <button className="hd-nav-btn signout" onClick={onLogout}>
                        <span className="hd-nav-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </span>
                        {!isSidebarCollapsed && <span className="hd-nav-label">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* ─── Main Content Area ─── */}
            <main className="hd-main">
                {/* Top Statistics Bar */}
                <header className="hd-topbar">
                    <div className="hd-topbar-left">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={activeTab}
                        >
                            {activeTab === 'queue' ? 'Patient Triage' :
                                activeTab === 'doctors' ? 'Provider Overviews' :
                                    activeTab === 'analytics' ? 'Clinical Insights' : 'Settings'}
                        </motion.h1>
                        <span className="hd-date">{new Date(currentTime).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })} · {new Date(currentTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="hd-topbar-stats">
                        <div className="hd-mini-stat">
                            <span className="label">Waiting</span>
                            <span className="val">{queuePatients.length}</span>
                        </div>
                        <div className="hd-mini-stat critical">
                            <span className="label">Urgent</span>
                            <span className="val">{highRiskCount}</span>
                        </div>
                        <div className="hd-mini-stat processed">
                            <span className="label">Processed</span>
                            <span className="val">{processedPatients.length}</span>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'queue' && (
                        <motion.div
                            className="hd-content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {/* Filters */}
                            <div className="hd-filters">
                                <div className="hd-tab-group">
                                    <button className={`hd-tab ${filterPriority === 'All' ? 'active' : ''}`} onClick={() => setFilterPriority('All')}>All Cases</button>
                                    <button className={`hd-tab ${filterPriority === 'HIGH' ? 'active' : ''}`} onClick={() => setFilterPriority('HIGH')}>High Priority</button>
                                    <button className={`hd-tab ${filterPriority === 'MEDIUM' ? 'active' : ''}`} onClick={() => setFilterPriority('MEDIUM')}>Routine</button>
                                </div>
                                <div className="hd-search">
                                    <span className="hd-search-icon">🔍</span>
                                    <input placeholder="Filter by name..." />
                                </div>
                            </div>

                            {/* Patient List */}
                            <div className="hd-list-container">
                                <div className="hd-table-header">
                                    <div className="col-pat">Patient</div>
                                    <div className="col-risk">Assessment</div>
                                    <div className="col-dept">Department</div>
                                    <div className="col-doc">Practitioner</div>
                                    <div className="col-wait">Wait</div>
                                    <div className="col-act"></div>
                                </div>
                                <div className="hd-list-body">
                                    {queuePatients.length === 0 ? (
                                        <div className="hd-empty-state">All queues are clear.</div>
                                    ) : (
                                        queuePatients.map((p, idx) => (
                                            <motion.div
                                                key={p.id}
                                                className={`hd-list-row ${p.risk.toLowerCase()}`}
                                                onClick={() => setSelectedPatient(p)}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                whileHover={{ scale: 1.005, backgroundColor: 'rgba(0,0,0,0.015)' }}
                                            >
                                                <div className="col-pat">
                                                    <span className="hd-pat-name">{p.name}</span>
                                                    <span className="hd-pat-meta">{p.age}y · {p.gender}</span>
                                                </div>
                                                <div className="col-risk">
                                                    <span className={`hd-badge ${p.risk.toLowerCase()}`}>{p.risk}</span>
                                                    <span className="hd-conf">{(p.confidence / 100).toFixed(2)} Match</span>
                                                </div>
                                                <div className="col-dept">{p.dept}</div>
                                                <div className="col-doc">{p.doctor}</div>
                                                <div className="col-wait">
                                                    <span className={Date.now() - p.admitted > 1000 * 60 * 30 ? 'hd-wait-long' : ''}>
                                                        {formatTimeAgo(p.admitted)}
                                                    </span>
                                                </div>
                                                <div className="col-act">
                                                    <button className="hd-btn-minimal">Review</button>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'doctors' && (
                        <motion.div
                            className="hd-content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <div className="hd-doc-grid">
                                {DOCTORS_LIST.map((doc, idx) => {
                                    const docPats = patients.filter(p => p.doctor === doc && p.status === 'pending');
                                    return (
                                        <motion.div
                                            key={doc}
                                            className="hd-doc-card"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
                                        >
                                            <div className="hd-doc-header">
                                                <div className="hd-avatar">{doc.split(' ').pop()[0]}</div>
                                                <div>
                                                    <h3>{doc}</h3>
                                                    <span className="hd-doc-sub">{docPats.length} patients in queue</span>
                                                </div>
                                            </div>
                                            <div className="hd-doc-pats">
                                                {docPats.map(p => (
                                                    <div key={p.id} className="hd-mini-row" onClick={() => setSelectedPatient(p)}>
                                                        <span className={`hd-dot ${p.risk.toLowerCase()}`}></span>
                                                        <span className="name">{p.name}</span>
                                                        <span className="wait">{formatTimeAgo(p.admitted)}</span>
                                                    </div>
                                                ))}
                                                {docPats.length === 0 && <span className="hd-no-cases">No pending clinical tasks</span>}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'analytics' && (
                        <motion.div
                            className="hd-analytics-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* ── Metric Grid ── */}
                            <div className="hd-analytics-grid">
                                {[
                                    { label: 'Avg. Triage Speed', val: '4.2', unit: 'min', change: '-12%', down: true },
                                    { label: 'AI Agreement Rate', val: '94', unit: '%', change: '+2.1%', down: false },
                                    { label: 'Throughput', val: '128', unit: 'pts/day', change: '+8%', down: false },
                                    { label: 'Urgency Ratio', val: '24', unit: '%', change: 'Stable', down: false }
                                ].map((m, i) => (
                                    <motion.div
                                        className="hd-metric-card"
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <span className="label">{m.label}</span>
                                        <div className="val-group">
                                            <span className="val">{m.val}</span>
                                            <span className="unit">{m.unit}</span>
                                        </div>
                                        <span className={`change ${m.down ? 'neg' : 'pos'}`}>{m.change}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* ── Visual Insights ── */}
                            <div className="hd-insights-panels">
                                <motion.div
                                    className="hd-insight-card wide"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="card-header">
                                        <h3>Clinical Load Trend</h3>
                                        <span>Last 24 Hours</span>
                                    </div>
                                    <div className="hd-chart-placeholder">
                                        {/* Simulated elegant minimalist chart */}
                                        <div className="hd-chart-bar-container">
                                            {[40, 65, 45, 80, 55, 90, 70, 40, 25, 30, 50, 60].map((h, i) => (
                                                <motion.div
                                                    className="hd-chart-bar"
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: 0.5 + (i * 0.05), duration: 1, ease: "circOut" }}
                                                />
                                            ))}
                                        </div>
                                        <div className="hd-chart-labels">
                                            <span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>00:00</span><span>04:00</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="hd-insight-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="card-header">
                                        <h3>Department Load</h3>
                                    </div>
                                    <div className="hd-dept-list">
                                        {[
                                            { name: 'Emergency', load: 85 },
                                            { name: 'Cardiology', load: 62 },
                                            { name: 'Neurology', load: 45 },
                                            { name: 'Pediatrics', load: 30 }
                                        ].map((d, i) => (
                                            <div className="hd-dept-row" key={i}>
                                                <div className="info">
                                                    <span>{d.name}</span>
                                                    <span className="pct">{d.load}%</span>
                                                </div>
                                                <div className="bar-bg">
                                                    <motion.div
                                                        className="bar-fill"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${d.load}%` }}
                                                        transition={{ delay: 0.8 + (i * 0.1), duration: 0.8 }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {activeTab === 'settings' && (
                    <motion.div
                        className="hd-settings-view"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="hd-settings-layout">
                            {/* Left: Settings Navigation */}
                            <div className="hd-settings-sidebar">
                                {['Hospital', 'Intelligence', 'Staff', 'Alerts', 'API'].map(s => (
                                    <button key={s} className="hd-settings-nav-item active">
                                        {s} Configuration
                                    </button>
                                ))}
                            </div>

                            {/* Right: Settings Content */}
                            <div className="hd-settings-main">
                                {/* Section 1: Hospital Info */}
                                <section className="hd-settings-section">
                                    <div className="section-header">
                                        <h3>Hospital Configuration</h3>
                                        <p>Primary identity and location metadata for SimpToms AI network.</p>
                                    </div>
                                    <div className="hd-settings-card glass-panel-hd">
                                        <div className="hd-settings-fields">
                                            <div className="form-field">
                                                <label>Institution Name</label>
                                                <input defaultValue="Mumbai City Hospital" className="form-input-hd" />
                                            </div>
                                            <div className="form-field">
                                                <label>Operating Location</label>
                                                <input defaultValue="Bandra West, Mumbai, MH" className="form-input-hd" />
                                            </div>
                                            <div className="form-field">
                                                <label>Emergency Contact</label>
                                                <input defaultValue="+91 22 1234 5678" className="form-input-hd" />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 2: AI Intelligence Sensitivity */}
                                <section className="hd-settings-section">
                                    <div className="section-header">
                                        <h3>Intelligence Engine</h3>
                                        <p>Calibrate AI sensitivity levels for clinical risk prioritization.</p>
                                    </div>
                                    <div className="hd-settings-card glass-panel-hd">
                                        <div className="hd-setting-row">
                                            <div className="info">
                                                <label>Risk Detection Sensitivity</label>
                                                <span>Increasing this will surface more potential medium-risk cases to High.</span>
                                            </div>
                                            <div className="control">
                                                <input type="range" className="hd-slider" defaultValue="80" />
                                            </div>
                                        </div>
                                        <div className="hd-divider-lite"></div>
                                        <div className="hd-setting-row">
                                            <div className="info">
                                                <label>Explainability Detail Level</label>
                                                <span>Determine how deep the AI reasoning panel goes for clinicians.</span>
                                            </div>
                                            <div className="control">
                                                <select className="form-select-hd">
                                                    <option>High (Clinical Evidence)</option>
                                                    <option>Moderate (Symptom Mapping)</option>
                                                    <option>Compact (Bullet Points)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3: Staff Management */}
                                <section className="hd-settings-section">
                                    <div className="section-header">
                                        <h3>Clinical Staff Access</h3>
                                        <p>Manage who can review and admit patients via this dashboard.</p>
                                    </div>
                                    <div className="hd-settings-card glass-panel-hd">
                                        <div className="hd-staff-list">
                                            {[
                                                { name: 'Dr. Mukherjee', role: 'Chief of Cardiology', status: 'Active' },
                                                { name: 'Dr. Priya Sharma', role: 'Managing Physician', status: 'Active' },
                                                { name: 'Dr. Rahul Mehta', role: 'Senior Resident', status: 'On Leave' }
                                            ].map((s, i) => (
                                                <div className="hd-staff-row" key={i}>
                                                    <div className="staff-info">
                                                        <div className="avatar-sm">{s.name[4]}</div>
                                                        <div>
                                                            <span className="name">{s.name}</span>
                                                            <span className="role">{s.role}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`status-pill ${s.status.toLowerCase().replace(' ', '-')}`}>{s.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="btn-add-staff">+ Add Medical Professional</button>
                                    </div>
                                </section>

                                <div className="hd-settings-footer">
                                    <button className="btn-save-settings" onClick={() => showToast('Configuration saved successfully')}>
                                        Save All Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* ─── Detail Panel (Slide Over) ─── */}
            {selectedPatient && (
                <div className="hd-overlay" onClick={() => setSelectedPatient(null)}>
                    <div className="hd-panel card" onClick={e => e.stopPropagation()}>
                        <div className="hd-panel-header">
                            <div>
                                <h2>{selectedPatient.name}</h2>
                                <span className="hd-panel-sub">{selectedPatient.age}yrs · {selectedPatient.gender} · ID #{selectedPatient.id}492</span>
                            </div>
                            <button className="hd-close-btn" onClick={() => setSelectedPatient(null)}>✕</button>
                        </div>

                        <div className="hd-panel-scroll">
                            {/* AI Alert Banner */}
                            {selectedPatient.risk === 'HIGH' && (
                                <div className="hd-alert-banner">
                                    <span className="icon">⚠️</span>
                                    <div>
                                        <strong>High Priority Case</strong>
                                        <p>Immediate medical attention recommended based on vitals analysis.</p>
                                    </div>
                                </div>
                            )}

                            {/* Live Vitals Grid */}
                            <div className="hd-section">
                                <h3>Live Vitals (Simulated)</h3>
                                <div className="hd-vitals-grid">
                                    {renderVital('Heart Rate', selectedPatient.vitals.hr, 'bpm', selectedPatient.vitals.hr > 100)}
                                    {renderVital('Blood Pressure', `${selectedPatient.vitals.bp_sys}/${selectedPatient.vitals.bp_dia}`, 'mmHg', selectedPatient.vitals.bp_sys > 140)}
                                    {renderVital('SpO2', `${selectedPatient.vitals.spo2}%`, '', selectedPatient.vitals.spo2 < 95)}
                                    {renderVital('Temp', `${selectedPatient.vitals.temp}°`, 'F', selectedPatient.vitals.temp > 100)}
                                </div>
                            </div>

                            {/* Symptoms & History */}
                            <div className="hd-section">
                                <h3>Clinical Presentation</h3>
                                <div className="hd-symptoms-list">
                                    {selectedPatient.symptoms.map(s => <span key={s} className="hd-pill">{s}</span>)}
                                </div>
                                <div className="hd-kv-grid">
                                    <div><label>Chief Complaint</label><span>{selectedPatient.symptoms[0]}</span></div>
                                    <div><label>Onset</label><span>~2 hours ago</span></div>
                                    <div><label>Triage Nurse</label><span>AI Assistant</span></div>
                                    <div><label>Department</label><span>{selectedPatient.dept}</span></div>
                                </div>
                            </div>

                            {/* AI Recommendation */}
                            <div className="hd-section">
                                <h3>AI Recommendation ({selectedPatient.confidence}% Conf.)</h3>
                                <div className="hd-recommendation-box">
                                    <p>{selectedPatient.action}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="hd-panel-footer">
                            <button className="hd-btn-full accept" onClick={() => handleAction(selectedPatient.id, 'accept')}>Admit Patient</button>
                            <button className="hd-btn-full escalate" onClick={() => handleAction(selectedPatient.id, 'escalate')}>Escalate Priority</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && <div className="hd-toast msg-enter">✓ {toast}</div>}
        </div>
    );
};

export default HospitalDashboard;
