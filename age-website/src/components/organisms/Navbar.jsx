import React from 'react';
import { Button } from '../ui/Button';

export function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-content">
                <div className="logo-container">
                    <img src="/logo.png" alt="AGE Logo" className="brand-logo" />
                    <span className="logo-text">AGE</span>
                </div>
                <div className="nav-links">
                    <a href="#expertise">Capabilities</a>
                    <a href="#cases">Architecture</a>
                    <Button as="a" href="#connect" variant="primary" size="sm">Initialize</Button>
                </div>
            </div>
        </nav>
    );
}
