import React from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Target } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { staggerContainer, fadeIn } from '../../lib/animations';

export function TechGrid() {
    return (
        <section className="tech-section" id="expertise">
            <motion.div
                className="tech-grid"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <GlassCard asMotion className="tech-card" variants={fadeIn}>
                    <Database className="tech-icon" />
                    <h3>Autonomous Agents</h3>
                    <p>Deploy multi-agent systems that reason, execute, and adapt to complex enterprise environments in real-time.</p>
                </GlassCard>
                <GlassCard asMotion className="tech-card" variants={fadeIn}>
                    <Zap className="tech-icon" />
                    <h3>Data Lakehouse</h3>
                    <p>Unified architecture combining the flexibility of data lakes with the performance of data warehouses.</p>
                </GlassCard>
                <GlassCard asMotion className="tech-card" variants={fadeIn}>
                    <Target className="tech-icon" />
                    <h3>Precision Scalability</h3>
                    <p>Infrastructure designed for infinite horizontal scaling with zero degradation in latency or throughput.</p>
                </GlassCard>
            </motion.div>
        </section>
    );
}
