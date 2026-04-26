import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  ['Is DeadlineMate only for university students?', 'It is designed around university workflows, but any student managing modules, exams, and coursework can use it.'],
  ['How is this different from a calendar?', 'Calendars store dates. DeadlineMate turns academic dates into priorities, study blocks, reminders, and progress.'],
  ['Can I manage multiple modules?', 'Yes. Pro is built for full-course planning across modules, assessments, exams, and study sessions.'],
  ['Will it work on mobile?', 'Yes. The experience is mobile-first, so students can check plans quickly between lectures.'],
  ['Does DeadlineMate use AI?', 'The planning experience is designed to feel intelligent and assistive, helping students break deadlines into practical steps.'],
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Everything students ask before switching.</h2>
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map(([question, answer], index) => (
            <div key={question} className="glass-panel rounded-[1.5rem] p-5">
              <button
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full items-center justify-between gap-6 text-left"
                aria-expanded={open === index}
              >
                <span className="text-lg font-black text-slate-950">{question}</span>
                <motion.span animate={{ rotate: open === index ? 45 : 0 }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-slate-950">
                  <Plus size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-4 leading-7 text-slate-600">{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
