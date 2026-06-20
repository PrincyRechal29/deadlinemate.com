import { CalendarCheck2 } from 'lucide-react';

export default function Logo({ compact = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.8)]">
        <CalendarCheck2 size={21} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="display-font block text-[1.05rem] font-bold tracking-tight text-[#0b1220]">DeadlineMate</span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#64748b]">Academic OS</span>
        </span>
      )}
    </span>
  );
}

export function BrandWordmark({ className = '' }) {
  return (
    <span className={`display-font inline-block font-bold tracking-tight ${className}`}>
      <span className="text-[#0b1220]">Deadline</span>
      <span className="gradient-text">Mate</span>
    </span>
  );
}
