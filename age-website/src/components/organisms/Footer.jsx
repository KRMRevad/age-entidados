import React from 'react';
import { Code, Github, Linkedin } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { fadeIn } from '../../lib/animations';

export function Footer() {
    return (
        <>
            <section className="connect-section" id="connect">
                <GlassCard asMotion className="connect-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <h2>Ready to evolve?</h2>
                    <p>Access our enterprise intelligence network.</p>
                    <div className="social-links">
                        <Button as="a" href="https://www.linkedin.com" target="_blank" rel="noreferrer" variant="social">
                            <Linkedin /> LinkedIn
                        </Button>
                        <Button as="a" href="https://www.workana.com" target="_blank" rel="noreferrer" variant="social">
                            <Code /> Workana
                        </Button>
                        <Button as="a" href="https://www.99freelas.com.br" target="_blank" rel="noreferrer" variant="social">
                            <Code /> 99Freelas
                        </Button>
                        <Button as="a" href="https://www.upwork.com" target="_blank" rel="noreferrer" variant="social">
                            <Github /> Upwork
                        </Button>
                    </div>
                </GlassCard>
            </section>

            <footer className="footer">
                <p>© 2026 AGE (EVAD B2B). All rights reserved.</p>
                <div className="footer-links">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">System Status</a>
                </div>
            </footer>
        </>
    );
}
