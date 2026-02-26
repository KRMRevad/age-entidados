import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { Navbar } from './components/organisms/Navbar';
import { Hero } from './components/organisms/Hero';
import { TechGrid } from './components/organisms/TechGrid';
import { Cases } from './components/organisms/Cases';
import { Footer } from './components/organisms/Footer';

import './index.css';

function App() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="app-container">
      <motion.div className="grid-background" style={{ y: yBg }} />
      <div className="gradient-glow" />

      <Navbar />
      <Hero opacityHero={opacityHero} scaleHero={scaleHero} />
      <TechGrid />
      <Cases />
      <Footer />
    </div>
  );
}

export default App;
