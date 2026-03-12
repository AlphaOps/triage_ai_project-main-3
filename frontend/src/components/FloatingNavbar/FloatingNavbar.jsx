import React from 'react';
import './FloatingNavbar.css';

const FloatingNavbar = ({ activePage, onNavigate, onLogout }) => {
    return (
        <nav className="f-nav f-nav-enter">
            <div className="f-nav-inner">
                {/* ── Brand ── */}
                <div className="f-brand">
                    <span className="f-logo">✦</span>
                    <span className="f-brand-text">SimpToms AI</span>
                </div>

                {/* ── Menu ── */}
                <div className="f-menu">
                    <button
                        className={`f-link ${activePage === 'home' ? 'active' : ''}`}
                        onClick={() => onNavigate('home')}
                    >
                        Home
                    </button>

                    <button
                        className={`f-link ${activePage === 'history' ? 'active' : ''}`}
                        onClick={() => onNavigate('history')}
                    >
                        My Assessments
                    </button>
                    <button
                        className={`f-link ${activePage === 'guidance' ? 'active' : ''}`}
                        onClick={() => onNavigate('guidance')}
                    >
                        AI Assistance
                    </button>
                </div>

                {/* ── Actions ── */}
                <div className="f-actions">
                    <button className="f-avatar-btn" onClick={() => onNavigate('profile')}>
                        <div className="f-avatar-img">JD</div>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default FloatingNavbar;
