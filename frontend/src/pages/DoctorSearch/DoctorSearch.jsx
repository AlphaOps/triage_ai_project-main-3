import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DoctorSearch.css';

/* ═══════════════════════════════════════════════════════════════════
   DOCTOR DATA — INDIAN CONTEXT (MUMBAI)
   ═══════════════════════════════════════════════════════════════════ */

const DOCTORS = [
    { id: 1, name: 'Dr. Aditi Agrawal', specialty: 'Cardiology', hospital: 'Asian Heart Institute', distance: '0.8 km', rating: 4.9, reviews: 312, experience: '18 years', fee: '₹1500', slots: ['9:00 AM', '10:30 AM', '2:00 PM'], available: true, lat: 19.0600, lng: 72.8335 },
    { id: 2, name: 'Dr. Rithik Oberoi', specialty: 'Neurology', hospital: 'Nanavati Super Speciality', distance: '3.2 km', rating: 4.8, reviews: 245, experience: '15 years', fee: '₹2000', slots: ['11:00 AM', '3:00 PM'], available: true, lat: 19.0968, lng: 72.8402 },
    { id: 3, name: 'Dr. Priya Sharma', specialty: 'General Medicine', hospital: 'Lilavati Hospital', distance: '0.5 km', rating: 4.7, reviews: 489, experience: '12 years', fee: '₹800', slots: ['9:30 AM', '11:30 AM', '1:00 PM', '4:00 PM'], available: true, lat: 19.0515, lng: 72.8286 },
    { id: 4, name: 'Dr. Vikram Singh', specialty: 'Orthopedics', hospital: 'Breach Candy Hospital', distance: '12 km', rating: 4.9, reviews: 198, experience: '22 years', fee: '₹2500', slots: ['10:00 AM', '2:30 PM'], available: true, lat: 18.9715, lng: 72.8096 },
    { id: 5, name: 'Dr. Anjali Desai', specialty: 'Pediatrics', hospital: 'Surya Child Care', distance: '4.8 km', rating: 4.8, reviews: 367, experience: '14 years', fee: '₹1200', slots: ['9:00 AM', '12:00 PM', '3:30 PM'], available: true, lat: 19.0762, lng: 72.8385 },
    { id: 6, name: 'Dr. Arjun Kapoor', specialty: 'Dermatology', hospital: 'Kokilaben Dhirubhai Ambani', distance: '7.5 km', rating: 4.6, reviews: 156, experience: '10 years', fee: '₹1800', slots: ['10:00 AM', '1:00 PM'], available: true, lat: 19.1316, lng: 72.8247 },
    { id: 7, name: 'Dr. Meera Iyer', specialty: 'Emergency Medicine', hospital: 'Fortis Hospital', distance: '14 km', rating: 4.9, reviews: 520, experience: '20 years', fee: '₹1000', slots: ['Always Available'], available: true, lat: 19.1601, lng: 72.9460 },
    { id: 8, name: 'Dr. Rajesh Khanna', specialty: 'Psychiatry', hospital: 'Hiranandani Hospital', distance: '16 km', rating: 4.7, reviews: 210, experience: '16 years', fee: '₹2200', slots: ['11:00 AM', '4:00 PM'], available: true, lat: 19.1186, lng: 72.9118 },
];

const USER_LOCATION = { lat: 19.0544, lng: 72.8402 };

const SPECIALTIES = ['All', 'Cardiology', 'Neurology', 'General Medicine', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Emergency Medicine', 'Psychiatry'];

/* ═══════════════════════════════════════════════════════════════════
   LEAFLET MAP INTEGRATION
   ═══════════════════════════════════════════════════════════════════ */

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
const TILE_ATTR = 'Tiles &copy; Esri';

function loadResource(tag, attrs) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`${tag}[${Object.keys(attrs)[0]}="${Object.values(attrs)[0]}"]`);
        if (existing) { resolve(); return; }
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        el.onload = resolve;
        el.onerror = reject;
        document.head.appendChild(el);
    });
}

function createDoctorIcon(L, isActive = false) {
    // Muted Clinical Styling: Slate Navy for Inactive, Deep Medical Blue for Active
    const color = isActive ? '#1e3a8a' : '#475569';
    const stroke = isActive ? '#fbbf24' : '#ffffff'; // Gold stroke for active
    const scale = isActive ? 1.2 : 1;

    // SVG Marker - Stable geometry to prevent jumping
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 24 32">
            <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="black" flood-opacity="0.3"/>
                </filter>
            </defs>
            <g transform="scale(${scale}) translate(${12 * (1 - scale)}, ${16 * (1 - scale)})">
                <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 4.5 12 4.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" 
                    fill="${color}" stroke="${stroke}" stroke-width="1.5" filter="url(#shadow)" />
            </g>
        </svg>
    `;

    return L.divIcon({
        html: svg,
        className: 'ds-leaflet-marker',
        iconSize: [36, 48],
        iconAnchor: [18, 48], // Anchored at bottom center
        popupAnchor: [0, -48],
    });
}

const LeafletMap = ({ doctors, highlightedId, highlightSource, onMarkerClick }) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const [leafletReady, setLeafletReady] = useState(false);

    // Initial Load
    useEffect(() => {
        let cancelled = false;
        (async () => {
            // Only load if not already loaded
            if (window.L) { setLeafletReady(true); return; }
            try {
                await loadResource('link', { rel: 'stylesheet', href: LEAFLET_CSS });
                await loadResource('script', { src: LEAFLET_JS });
                const waitForL = () => new Promise(resolve => {
                    const check = () => window.L ? resolve() : setTimeout(check, 50);
                    check();
                });
                await waitForL();
                if (!cancelled) setLeafletReady(true);
            } catch (e) { console.error('Leaflet load error', e); }
        })();
        return () => { cancelled = true; };
    }, []);

    // Initialize Map Instance
    useEffect(() => {
        if (!leafletReady || !containerRef.current || mapRef.current) return;
        const L = window.L;

        const map = L.map(containerRef.current, {
            center: [USER_LOCATION.lat, USER_LOCATION.lng],
            zoom: 13,
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: true,
        });

        L.control.zoom({ position: 'topright' }).addTo(map);
        L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

        L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);

        // User Location Marker
        const userIcon = L.divIcon({
            html: `<svg width="24" height="24"><circle cx="12" cy="12" r="8" fill="#10b981" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="12" fill="#10b981" fill-opacity="0.3"/></svg>`,
            className: 'ds-leaflet-user',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        L.marker([USER_LOCATION.lat, USER_LOCATION.lng], { icon: userIcon, zIndexOffset: 1000 })
            .addTo(map)
            .bindPopup('<div class="ds-map-popup-user"><strong>You are here</strong></div>', { closeButton: false });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [leafletReady]);

    // Manage Markers (Create/Remove)
    useEffect(() => {
        if (!mapRef.current || !leafletReady) return;
        const L = window.L;
        const map = mapRef.current;

        // Clear existing markers
        Object.values(markersRef.current).forEach(m => m.remove());
        markersRef.current = {};

        doctors.forEach(doc => {
            const marker = L.marker([doc.lat, doc.lng], {
                icon: createDoctorIcon(L, false), // Start inactive
            }).addTo(map);

            const popupContent = `
                <div class="ds-map-popup">
                    <div class="ds-map-popup-name">${doc.name}</div>
                    <div class="ds-map-popup-spec">${doc.specialty}</div>
                    <div class="ds-map-popup-hospital">${doc.hospital}</div>
                    <div class="ds-map-popup-meta">
                        <span>★ ${doc.rating}</span>
                        <span>${doc.distance}</span>
                        <span style="color:var(--ink); font-weight:600">${doc.fee}</span>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                className: 'ds-leaflet-popup',
                closeButton: false,
                offset: [0, -10],
                maxWidth: 240,
                autoPan: true, // Allow small autopan for popup visibility
                autoPanPadding: [20, 20]
            });

            marker.on('click', () => {
                if (onMarkerClick) onMarkerClick(doc);
            });

            markersRef.current[doc.id] = marker;
        });

    }, [doctors, leafletReady]); // Removed highlightedId dependency to prevent re-creation

    // Handle Highlighting & Panning
    useEffect(() => {
        if (!mapRef.current) return;
        const L = window.L;

        Object.entries(markersRef.current).forEach(([id, marker]) => {
            const isActive = parseInt(id) === highlightedId;
            // Update icon state without recreating marker
            marker.setIcon(createDoctorIcon(L, isActive));
            marker.setZIndexOffset(isActive ? 1000 : 0);

            if (isActive) {
                // Open popup if not already open
                if (!marker.isPopupOpen()) marker.openPopup();

                // Pan ONLY if source is list to prevent jumpiness on click
                if (highlightSource === 'list') {
                    mapRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.8 });
                }
            }
        });

    }, [highlightedId, highlightSource]);

    return (
        <div className="ds-map-container" ref={containerRef}>
            {!leafletReady && <div className="ds-map-loading"><span>Loading Map...</span></div>}
        </div>
    );
};


/* ═══════════════════════════════════════════════════════════════════
   DOCTOR SEARCH PAGE
   ═══════════════════════════════════════════════════════════════════ */

const DoctorSearch = ({ onBack }) => {
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('All');

    // highlightSource: 'list' (hover) or 'map' (click)
    const [highlightState, setHighlightState] = useState({ id: null, source: null });

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showBooking, setShowBooking] = useState(false);
    const [visitType, setVisitType] = useState('in-person');
    const [showConfirm, setShowConfirm] = useState(false);

    const filtered = DOCTORS.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.hospital.toLowerCase().includes(search.toLowerCase());
        const matchSpec = specialty === 'All' || d.specialty === specialty;
        return matchSearch && matchSpec;
    });

    // Handlers
    const handleListHover = useCallback((id) => {
        setHighlightState({ id, source: 'list' });
    }, []);

    const handleListLeave = useCallback(() => {
        // Optional: clear highlight on leave? 
        // Better to keep it to avoid popup closing immediately
    }, []);

    const handleMarkerClick = useCallback((doc) => {
        setHighlightState({ id: doc.id, source: 'map' });
        // Don't auto-select for booking, just show popup
    }, []);

    const handleSlotClick = (doctor, slot) => {
        setSelectedDoctor(doctor);
        setSelectedSlot(slot);
        setVisitType('in-person');
        setShowBooking(true);
        setShowConfirm(false);
    };

    const handleConfirm = () => {
        setShowBooking(false);
        setShowConfirm(true);
        setTimeout(() => setShowConfirm(false), 4000);
    };

    return (
        <div className="ds-page">
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

            <div className="ds-layout">
                {/* Left — Filters + List */}
                <div className="ds-left">
                    <div className="ds-header fade-in">
                        <h1>Find a Specialist</h1>
                        <p>{filtered.length} doctors near Mumbai, Maharashtra</p>
                    </div>

                    <div className="ds-filters fade-in fade-in-delay-1">
                        <div className="ds-search-bar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                            <input placeholder="Search by name, hospital or area..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="ds-spec-pills">
                            {SPECIALTIES.map(s => (
                                <button key={s} className={`ds-spec-pill ${specialty === s ? 'active' : ''}`} onClick={() => setSpecialty(s)}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <div className="ds-list">
                        {filtered.map((d, i) => (
                            <div
                                key={d.id}
                                className={`ds-doctor card fade-in fade-in-delay-${Math.min(i + 1, 5)} ${highlightState.id === d.id ? 'ds-doctor-highlighted' : ''}`}
                                onMouseEnter={() => handleListHover(d.id)}
                            >
                                <div className="ds-doc-top">
                                    <div className="ds-doc-avatar">{d.name.split(' ').pop()[0]}</div>
                                    <div className="ds-doc-info">
                                        <h3>{d.name}</h3>
                                        <span className="ds-doc-spec">{d.specialty}</span>
                                    </div>
                                    <div className="ds-doc-rating">
                                        <span className="ds-star">★</span> {d.rating}
                                        <span className="ds-reviews">({d.reviews})</span>
                                    </div>
                                </div>
                                <div className="ds-doc-meta">
                                    <span>🏥 {d.hospital}</span>
                                    <span>📍 {d.distance}</span>
                                    <span>🕐 {d.experience}</span>
                                    <span>💰 {d.fee}</span>
                                </div>
                                <div className="ds-doc-slots">
                                    <span className="ds-slots-label">Available today:</span>
                                    <div className="ds-slot-btns">
                                        {d.slots.map(slot => (
                                            <button key={slot} className="ds-slot-btn" onClick={() => handleSlotClick(d, slot)}>{slot}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="ds-empty card">
                                <p>No doctors match your search criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right — Leaflet Map */}
                <div className="ds-right fade-in fade-in-delay-2">
                    <div className="ds-map card">
                        <LeafletMap
                            doctors={filtered}
                            highlightedId={highlightState.id}
                            highlightSource={highlightState.source}
                            onMarkerClick={handleMarkerClick}
                        />
                        <div className="ds-map-footer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <span>Showing {filtered.length} specialists in Mumbai</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Booking Modal ─── */}
            {showBooking && selectedDoctor && (
                <div className="ds-confirm-overlay" onClick={() => setShowBooking(false)}>
                    <div className="ds-booking card" onClick={e => e.stopPropagation()}>
                        <h2>Book Appointment</h2>
                        <p className="ds-booking-sub">Confirm your appointment details below.</p>

                        <div className="ds-booking-details">
                            <div className="ds-booking-row">
                                <span className="ds-booking-label">Doctor</span>
                                <span className="ds-booking-value">{selectedDoctor.name}</span>
                            </div>
                            <div className="ds-booking-row">
                                <span className="ds-booking-label">Specialty</span>
                                <span className="ds-booking-value">{selectedDoctor.specialty}</span>
                            </div>
                            <div className="ds-booking-row">
                                <span className="ds-booking-label">Hospital</span>
                                <span className="ds-booking-value">{selectedDoctor.hospital}</span>
                            </div>
                            <div className="ds-booking-row">
                                <span className="ds-booking-label">Date</span>
                                <span className="ds-booking-value">Tomorrow, Feb 16</span>
                            </div>
                            <div className="ds-booking-row">
                                <span className="ds-booking-label">Time Slot</span>
                                <span className="ds-booking-value ds-booking-slot">{selectedSlot}</span>
                            </div>
                            <div className="ds-booking-row">
                                <span className="ds-booking-label">Consultation Fee</span>
                                <span className="ds-booking-value">{selectedDoctor.fee}</span>
                            </div>
                        </div>

                        <div className="ds-visit-type">
                            <span className="ds-booking-label">Visit Type</span>
                            <div className="ds-visit-options">
                                <button className={`ds-visit-btn ${visitType === 'in-person' ? 'active' : ''}`} onClick={() => setVisitType('in-person')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                    In-Person
                                </button>
                                <button className={`ds-visit-btn ${visitType === 'teleconsult' ? 'active' : ''}`} onClick={() => setVisitType('teleconsult')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.6 11.6L22 7v10l-6.4-4.6" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg>
                                    Video Call
                                </button>
                            </div>
                        </div>

                        <div className="ds-booking-actions">
                            <button className="btn-primary" onClick={handleConfirm}>Confirm Appointment</button>
                            <button className="btn-secondary" onClick={() => setShowBooking(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Success Toast ─── */}
            {showConfirm && (
                <div className="ds-toast msg-enter">
                    <div className="ds-toast-icon">✓</div>
                    <div className="ds-toast-text">
                        <strong>Appointment Toolkit</strong>
                        <span>Booked with {selectedDoctor?.name} · {selectedSlot}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorSearch;
