import React from 'react';
import './Loader.css';

const Loader = ({ size = 'md', className = '' }) => {
    return (
        <div className={`loader-container ${className}`}>
            <div className={`loader loader-${size} loader-pulse`}></div>
        </div>
    );
};

export default Loader;
