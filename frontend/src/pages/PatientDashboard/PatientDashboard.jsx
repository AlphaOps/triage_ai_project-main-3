import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FloatingNavbar from '../../components/FloatingNavbar/FloatingNavbar';
import VoiceIntakeModal from '../../components/VoiceIntakeModal/VoiceIntakeModal';
import './PatientDashboard.css';

const PatientDashboard = ({
    onStartAssessment,
    onOpenChat,
    onLogout,
    onDoctorSearch,
    onPrescription,
    onTimeline,
    onVoiceAgent
}) => {
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

    const handleNavigate = (action) => {
        switch (action) {
            case 'home': break; // Already here
            case 'assessment': onStartAssessment(); break;
            case 'history': onTimeline(); break;
            case 'guidance': onOpenChat(); break;
            case 'voice': onVoiceAgent(); break;
            case 'scan': onPrescription(); break;
            case 'profile': onDoctorSearch(); break; // Placeholder
            default: break;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
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
                stiffness: 100
            }
        }
    };

    return (
        <div className="pd">
            {/* ── Top Navigation ── */}
            <FloatingNavbar activePage="home" onNavigate={handleNavigate} onLogout={onLogout} />

            {/* ── Top Right Actions ── */}
            <div className="pd-top-right">
                <button className="pd-logout-btn" onClick={onLogout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>Log Out</span>
                </button>
            </div>

            {/* ── AI Modules ── */}
            <VoiceIntakeModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />

            {/* ── Immersive Workspace ── */}
            <main className="pd-workspace">

                {/* Left: Primary Action Area */}
                <motion.div
                    className="pd-hero-content"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.span className="pd-greeting-sub" variants={itemVariants}>Medically Verified Triage</motion.span>

                    <motion.h1 className="pd-title" variants={itemVariants}>
                        Begin Your <br />
                        Assessment
                    </motion.h1>

                    <motion.p className="pd-subtitle" variants={itemVariants}>
                        Describe symptoms, receive explainable AI prioritisation,
                        and get directed to appropriate care — without diagnosis.
                    </motion.p>

                    <motion.div className="pd-actions" variants={itemVariants}>
                        <motion.button
                            className="btn-start-assess"
                            onClick={onStartAssessment}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Start Assessment</span>
                            <span style={{ fontSize: '1.2rem' }}>→</span>
                        </motion.button>

                        <motion.button
                            className="btn-scan-report"
                            onClick={onPrescription}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="icon">📄</span>
                            <span>Scan Report</span>
                        </motion.button>

                        <button className="btn-voice-link" onClick={onVoiceAgent}>
                            Use Voice Mode
                        </button>
                    </motion.div>
                </motion.div>

                {/* Right: Abstract Visual Area */}
                <motion.div
                    className="pd-visual-area"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="pd-visual-orb">
                        <img
                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800"
                            alt="Doctor"
                            className="pd-orb-img"
                        />
                        <div className="pd-orb-overlay"></div>
                        <motion.button
                            className="btn-specialties-glass"
                            onClick={onDoctorSearch}
                            whileHover={{ y: -5, scale: 1.05 }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                        >
                            Find Specialists Nearby
                        </motion.button>
                    </div>
                    <div className="pd-visual-ring"></div>
                </motion.div>
            </main>

            {/* ── Doctors Nearby Section ── */}
            <section className="pd-doctors-section">
                <div className="pd-section-header">
                    <h2>Doctors Nearby</h2>
                    <button className="btn-view-all" onClick={onDoctorSearch}>View All →</button>
                </div>
                <motion.div
                    className="pd-doctor-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    {[
                        { name: 'Dr. Sarah Ishani', specialty: 'General Physician', rating: '4.9', dist: '1.2 km', img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=200&h=200' },
                        { name: 'Dr. Rahul Mehta', specialty: 'Cardiologist', rating: '4.8', dist: '2.4 km', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200' },
                        { name: 'Dr. Anita Desai', specialty: 'Neurologist', rating: '5.0', dist: '3.1 km', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200' },
                    ].map((doc, idx) => (
                        <motion.div
                            key={idx}
                            className="pd-doctor-card"
                            onClick={onDoctorSearch}
                            variants={itemVariants}
                            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        >
                            <img src={doc.img} alt={doc.name} className="pd-doc-img" />
                            <div className="pd-doc-info">
                                <h3>{doc.name}</h3>
                                <p>{doc.specialty}</p>
                                <div className="pd-doc-meta">
                                    <span className="rating">⭐ {doc.rating}</span>
                                    <span className="dist">📍 {doc.dist}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
};

export default PatientDashboard;
