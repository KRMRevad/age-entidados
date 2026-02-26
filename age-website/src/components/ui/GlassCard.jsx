import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './GlassCard.css';

export const GlassCard = forwardRef(({ children, className = '', asMotion = false, ...props }, ref) => {
    const Component = asMotion ? motion.div : 'div';

    return (
        <Component
            ref={ref}
            className={`glass-card ${className}`.trim()}
            {...props}
        >
            {children}
        </Component>
    );
});

GlassCard.displayName = 'GlassCard';
