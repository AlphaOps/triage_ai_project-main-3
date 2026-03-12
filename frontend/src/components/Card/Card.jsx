import React from 'react';
import './Card.css';

const Card = ({
    children,
    glass = false,
    hover = false,
    padding = 'md',
    className = '',
    ...props
}) => {
    const classes = `
    card 
    ${glass ? 'card-glass' : ''} 
    ${hover ? 'card-hover' : ''} 
    card-padding-${padding}
    ${className}
  `;

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export default Card;
