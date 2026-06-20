import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  ['Is DeadlineMate only for university students?', 'It is designed around university workflows, but any student managing modules, exams, and coursework can use it.'],
  ['How is this different from a calendar?', 'Calendars store dates. DeadlineMate turns academic dates into priorities, study blocks, reminders, and progress.'],
  ['Can I import deadlines from my university?', 'Yes. Paste your LMS calendar link (Canvas, Moodle, Blackboard, or Google Classroom) and your deadlines sync automatically.'],
  ['Will it work on my phone?', 'Yes. DeadlineMate is mobile-first, so you can check your plan quickly between lectures.'],
  ['What do I get for free?', 'Unlimited assignments, email reminders, and one calendar import — free forever, no credit card needed.'],
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Questions, answered.
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;
            return (
              <div key={question} className="card p-1">
                <button
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-slate-950">{question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700"
                  >
                    <Plus size={17} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 leading-7 text-slate-600">{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
