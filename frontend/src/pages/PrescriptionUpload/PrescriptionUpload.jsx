import React, { useState } from 'react';
import './PrescriptionUpload.css';

const MOCK_RESULTS = {
    medications: [
        { name: 'Amlodipine 5mg', category: 'Calcium Channel Blocker', frequency: 'Once daily, morning', purpose: 'Blood pressure management', risk: 'low', notes: 'Take with or without food. Avoid grapefruit juice.' },
        { name: 'Metformin 500mg', category: 'Biguanide', frequency: 'Twice daily, with meals', purpose: 'Blood sugar regulation', risk: 'low', notes: 'Take with food to reduce GI side effects.' },
        { name: 'Atorvastatin 20mg', category: 'Statin', frequency: 'Once daily, evening', purpose: 'Cholesterol management', risk: 'medium', notes: 'Regular liver function monitoring recommended.' },
        { name: 'Aspirin 75mg', category: 'Antiplatelet', frequency: 'Once daily', purpose: 'Cardiovascular prophylaxis', risk: 'low', notes: 'Take with food. Watch for signs of unusual bleeding.' },
    ],
    interactions: [
        { drugs: 'Amlodipine + Atorvastatin', severity: 'minor', note: 'May slightly increase atorvastatin levels. Monitor for muscle pain.' },
    ],
    summary: 'This prescription contains 4 medications primarily for cardiovascular and metabolic management. One minor drug interaction detected. No critical risk flags identified.'
};

const PrescriptionUpload = ({ onBack }) => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFile = (f) => {
        setFile(f);
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setResults(MOCK_RESULTS);
        }, 2200);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e) => {
        if (e.target.files[0]) handleFile(e.target.files[0]);
    };

    const riskColor = (risk) => risk === 'medium' ? 'medium' : risk === 'high' ? 'high' : 'low';

    return (
        <div className="pu-page">
            <nav className="ds-nav">
                <div className="grid-container ds-nav-inner">
                    <button className="ds-back" onClick={onBack}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Dashboard
                    </button>
                    <div className="pd-brand">
                        <span className="pd-logo">✦</span>
                        <span>SimpToms AI</span>
                    </div>
                </div>
            </nav>

            <div className="pu-content grid-container">
                {!results && !analyzing && (
                    <div className="pu-upload-section fade-in">
                        <div className="pu-header">
                            <span className="pu-tag">AI-Powered Analysis</span>
                            <h1>Prescription Scanner</h1>
                            <p>Upload a prescription image or PDF for intelligent medication analysis.</p>
                        </div>

                        <div
                            className={`pu-dropzone card ${dragOver ? 'drag-over' : ''}`}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <div className="pu-drop-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                </svg>
                            </div>
                            <h3>Drag & drop your prescription</h3>
                            <p>or click to browse files</p>
                            <span className="pu-formats">Supports JPG, PNG, PDF</span>
                            <input type="file" className="pu-file-input" accept="image/*,.pdf" onChange={handleChange} />
                        </div>

                        <div className="pu-demo-note card">
                            <span className="pu-note-icon">ℹ️</span>
                            <p>This is a demonstration. Upload any file to see simulated analysis results with synthetic medication data.</p>
                        </div>
                    </div>
                )}

                {analyzing && (
                    <div className="pu-analyzing fade-in">
                        <span className="pu-a-icon">✦</span>
                        <h2>Analysing prescription</h2>
                        <p>Detecting medications and checking interactions...</p>
                        <div className="al-bar"><div className="al-fill pu-fill-anim"></div></div>
                    </div>
                )}

                {results && (
                    <div className="pu-results fade-in">
                        <div className="pu-results-header">
                            <span className="pu-tag">✓ Analysis Complete</span>
                            <h1>Prescription Analysis</h1>
                            <p>{file?.name || 'prescription.pdf'}</p>
                        </div>

                        <div className="pu-summary card fade-in fade-in-delay-1">
                            <h3>Summary</h3>
                            <p>{results.summary}</p>
                        </div>

                        <div className="pu-meds-grid">
                            {results.medications.map((med, i) => (
                                <div key={i} className={`pu-med card fade-in fade-in-delay-${Math.min(i + 2, 5)}`}>
                                    <div className="pu-med-header">
                                        <h3>{med.name}</h3>
                                        <span className={`pu-risk-badge ${riskColor(med.risk)}`}>{med.risk} risk</span>
                                    </div>
                                    <span className="pu-med-cat">{med.category}</span>
                                    <div className="pu-med-details">
                                        <div className="pu-med-row"><span>Purpose</span><span>{med.purpose}</span></div>
                                        <div className="pu-med-row"><span>Frequency</span><span>{med.frequency}</span></div>
                                    </div>
                                    <div className="pu-med-notes">
                                        <span className="pu-notes-label">Notes</span>
                                        <p>{med.notes}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {results.interactions.length > 0 && (
                            <div className="pu-interactions card fade-in fade-in-delay-5">
                                <h3>Drug Interactions</h3>
                                {results.interactions.map((int, i) => (
                                    <div key={i} className="pu-int-item">
                                        <span className={`pu-int-badge ${int.severity}`}>{int.severity}</span>
                                        <div>
                                            <strong>{int.drugs}</strong>
                                            <p>{int.note}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pu-actions fade-in fade-in-delay-6">
                            <button className="btn-primary" onClick={() => { setFile(null); setResults(null); }}>Upload Another</button>
                            <button className="btn-secondary" onClick={onBack}>Back to Dashboard</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrescriptionUpload;
