import React from 'react';
import './Button.css';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    as = 'button',
    className = '',
    ...props
}) {
    const Component = as;
    const classes = `btn btn-${variant} btn-${size} ${className}`.trim();

    return (
        <Component className={classes} {...props}>
            {children}
        </Component>
    );
}
