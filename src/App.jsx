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
    <main className="min-h-screen overflow-hidden bg-[#dbeafe] text-[#07111f]">
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
      <a
        href="#pricing"
        className="button-primary fixed inset-x-4 bottom-4 z-50 flex min-h-12 items-center justify-center rounded-full text-sm font-black transition active:scale-95 md:hidden"
      >
        Start Free
      </a>
    </main>
  );
}
