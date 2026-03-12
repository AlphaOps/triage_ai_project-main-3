import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon,
    ...props
}) => {
    const classes = `btn btn-${variant} btn-${size} ${className}`;

    return (
        <button className={classes} {...props}>
            {icon && <span className="btn-icon">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
