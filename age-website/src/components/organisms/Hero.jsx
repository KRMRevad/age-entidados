import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { fadeIn, staggerContainer } from '../../lib/animations';

export function Hero({ opacityHero, scaleHero }) {
    return (
        <motion.section
            className="hero-section"
            style={{ opacity: opacityHero, scale: scaleHero }}
        >
            <motion.div
                className="hero-content"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <Badge asMotion variants={fadeIn} variant="subtle" size="md">
                    <Sparkles size={14} />
                    <span>EVAD B2B Intelligence</span>
                </Badge>
                <motion.h1 variants={fadeIn} className="hero-title">
                    The New Era of<br />
                    Enterprise Intelligence.
                </motion.h1>
                <motion.p variants={fadeIn} className="hero-subtitle">
                    Unlock actionable insights and autonomous workflows with our premium AI-driven platform. We engineer the impossible for global businesses.
                </motion.p>
                <motion.div variants={fadeIn} className="hero-actions">
                    <Button as="a" href="#connect" variant="primary">
                        Initialize Project <ArrowRight size={18} />
                    </Button>
                    <Button as="a" href="#cases" variant="outline">
                        View Architecture
                    </Button>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
