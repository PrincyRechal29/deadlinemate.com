import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import SocialProof from './components/SocialProof.jsx';
import Features from './components/Features.jsx';
import ProductDemo from './components/ProductDemo.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Testimonials from './components/Testimonials.jsx';
import Pricing from './components/Pricing.jsx';
import FAQ from './components/FAQ.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f7fb] text-[#0b1220]">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <ProductDemo />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
