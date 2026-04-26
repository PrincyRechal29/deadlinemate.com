import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import DashboardPreview from './components/DashboardPreview.jsx';
import Pricing from './components/Pricing.jsx';
import FAQ from './components/FAQ.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Pricing />
      <FAQ />
      <section id="waitlist" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="shine-panel mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-cyan-950/30 backdrop-blur md:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Waitlist</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Start managing your deadlines smarter today.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Be first to try DeadlineMate when it launches for students, course reps, and university teams.
          </p>
          <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="student@university.ac.uk"
              aria-label="Email address"
              className="min-h-12 flex-1 rounded-full border border-white/10 bg-slate-900/80 px-5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/15"
            />
            <button className="button-glow min-h-12 rounded-full bg-cyan-300 px-7 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-white">
              Join the Waitlist
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
