import { CalendarCheck2, TrendingUp } from 'lucide-react';

export default function Logo({ compact = false }) {
  return (
    <span className="flex items-center gap-3">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#284cff,#00b8d9_52%,#b5f05a)] text-[#07111f] shadow-lg shadow-blue-500/20">
        <CalendarCheck2 size={23} strokeWidth={2.4} />
        <TrendingUp className="absolute right-1 top-1 text-slate-950/85" size={16} strokeWidth={3} />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="display-font block text-lg font-bold tracking-tight text-[#07111f]">DeadlineMate</span>
          <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#284cff]">Academic OS</span>
        </span>
      )}
    </span>
  );
}

export function BrandWordmark({ className = '' }) {
  return <span className={`brand-wordmark inline-block font-black tracking-tight ${className}`}>DeadlineMate</span>;
}
