import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Features from './components/Features.jsx';
import ProductDemo from './components/ProductDemo.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Stats from './components/Stats.jsx';
import Pricing from './components/Pricing.jsx';
import Testimonials from './components/Testimonials.jsx';
import FAQ from './components/FAQ.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';

/** Duolingo-style scroll progress bar pinned to the top of the viewport. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100,
        background: 'var(--accent)', transformOrigin: '0%', scaleX,
      }}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(false);
  // Landing CTAs take you into the product (which routes to login if needed).
  const cta = () => navigate('/app');
  return (
    <MotionConfig reducedMotion="user">
    <div style={{ minHeight: '100vh', overflowX: 'hidden', color: 'var(--ink)' }}>
      <div className="dm-aura" aria-hidden />
      <ScrollProgress />
      <AnnouncementBar onCta={cta} />
      <Navbar onCta={cta} />
      <main>
        <Hero onCta={cta} />
        <Marquee />
        <Features />
        <ProductDemo />
        <HowItWorks />
        <Stats />
        <Pricing onCta={cta} />
        <Testimonials />
        <FAQ onCta={cta} />
        <CTA onCta={cta} />
      </main>
      <Footer />
      <Toast show={toast} onClose={() => setToast(false)} />
    </div>
    </MotionConfig>
  );
}
