import React from 'react';
import { motion } from 'framer-motion';
import './Badge.css';

export const Badge = React.forwardRef(({
    children,
    className = '',
    variant = 'subtle',
    size = 'sm',
    asMotion = false,
    ...props
}, ref) => {
    const Component = asMotion ? motion.div : 'span';

    return (
        <Component
            ref={ref}
            className={`badge badge-${variant} badge-${size} ${className}`.trim()}
            {...props}
        >
            {children}
        </Component>
    );
});

Badge.displayName = 'Badge';
