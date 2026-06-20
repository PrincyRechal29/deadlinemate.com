import React from 'react';
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

export default function App() {
  const [toast, setToast] = React.useState(false);
  const cta = () => setToast(true);
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', background: 'var(--page)', color: 'var(--ink)' }}>
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
  );
}
