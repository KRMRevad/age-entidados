import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { ShowcaseImage } from '../ui/ShowcaseImage';
import { fadeIn } from '../../lib/animations';

export function Cases() {
    return (
        <section className="cases-section" id="cases">
            <motion.h2
                className="section-title"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                Architecture Blueprints
            </motion.h2>

            <div className="cases-timeline">
                <motion.div
                    className="case-item"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                >
                    <ShowcaseImage src="/mockup.png" alt="AGE Dashboard Interface" />
                    <div className="case-info">
                        <h3>FinTech NLP Core</h3>
                        <p>Implemented an autonomous semantic router handling 100k+ daily WhatsApp interactions, reducing human escalation by 92% while increasing CSAT.</p>
                        <div className="tech-tags">
                            <Badge variant="outline">RAG</Badge>
                            <Badge variant="outline">Vector DB</Badge>
                            <Badge variant="outline">OpenAI</Badge>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="case-item reverse"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                >
                    <ShowcaseImage src="/wallpaper.png" alt="AGE Geometric Topology" isReversed />
                    <div className="case-info">
                        <h3>Global Market Scraper</h3>
                        <p>Distributed scraping infrastructure processing 5M+ competitor data points daily across restrictive anti-bot environments.</p>
                        <div className="tech-tags">
                            <Badge variant="outline">Puppeteer</Badge>
                            <Badge variant="outline">Proxies</Badge>
                            <Badge variant="outline">n8n</Badge>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="case-item"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                >
                    <ShowcaseImage src="/logo.png" alt="AGE Monogram Concept" imageClassName="logo-showcase" />
                    <div className="case-info">
                        <h3>Sales Pipeline Matrix</h3>
                        <p>Zero-touch lead qualification system converting raw inbound traffic into scored, enriched CRM entities autonomously.</p>
                        <div className="tech-tags">
                            <Badge variant="outline">HubSpot</Badge>
                            <Badge variant="outline">Webhooks</Badge>
                            <Badge variant="outline">Agentic UI</Badge>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
