import React from 'react';
import heroImage from '../../assets/hero-hospital.png';

const HeroBackground = () => {
    return (
        <div
            className="hero-fixed-background"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                overflow: 'hidden',
                pointerEvents: 'none',
                background: '#0f172a'
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.9)',
                }}
            />
            {/* Subtle gradient overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.3) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};

export default HeroBackground;
