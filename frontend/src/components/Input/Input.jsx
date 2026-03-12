import React from 'react';
import './Input.css';

const Input = ({
    label,
    icon,
    className = '',
    ...props
}) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-container">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    className={`input-field ${icon ? 'input-with-icon' : ''}`}
                    {...props}
                />
            </div>
        </div>
    );
};

export default Input;
