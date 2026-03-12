import React from 'react';
import './Badge.css';

const Badge = ({
    level = 'neutral',
    children,
    showDot = true,
    className = ''
}) => {
    return (
        <span className={`badge badge-${level} ${className}`}>
            {showDot && <span className="badge-dot" />}
            {children || level}
        </span>
    );
};

export default Badge;
