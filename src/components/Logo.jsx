import { CalendarCheck2, TrendingUp } from 'lucide-react';

export default function Logo({ compact = false }) {
  return (
    <span className="flex items-center gap-3">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-300 via-emerald-300 to-teal-500 text-slate-950 shadow-lg shadow-cyan-500/25">
        <CalendarCheck2 size={23} strokeWidth={2.4} />
        <TrendingUp className="absolute right-1 top-1 text-slate-950/85" size={16} strokeWidth={3} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tight text-white">DeadlineMate</span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">Plan smarter</span>
        </span>
      )}
    </span>
  );
}

export function BrandWordmark({ className = '' }) {
  return (
    <span className={`brand-wordmark inline-block font-black leading-none tracking-tight ${className}`}>
      DeadlineMate
    </span>
  );
}
