import { ArrowUpRight, Sparkles } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';

export function SplineSceneBasic() {
  return (
    <Card className="relative h-[500px] w-full overflow-hidden rounded-[2rem] border-white/10 bg-black/[0.96] text-white shadow-2xl shadow-cyan-300/25">
      <Spotlight className="-top-32 left-0 md:left-36 md:-top-12" fill="white" />

      <div className="absolute inset-x-6 top-6 z-10 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200/80">Live 3D overview</p>
          <p className="mt-1 text-sm text-white/70">Real-time semester visibility</p>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">Active</span>
      </div>

      <div className="relative z-10 flex h-full flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-center p-8 pt-28 lg:p-10 lg:pt-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">
            <Sparkles size={14} />
            Interactive planning
          </div>
          <h3 className="mt-5 max-w-sm text-4xl font-bold leading-tight md:text-5xl">
            See your semester as a living system.
          </h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-neutral-300 md:text-base">
            DeadlineMate turns assignments, exams, focus sessions, and study momentum into one visual workspace that feels alive instead of static.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              'Assignments and exams stay in sync',
              'Study sessions adapt to urgency',
              'Progress stays visible across modules',
              'Designed for laptop and mobile workflows',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-neutral-200">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">
            Explore the interactive workspace
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div className="relative min-h-[260px] flex-1 lg:min-h-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_42%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.18),transparent_48%)]" />
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full scale-[1.02]"
          />
        </div>
      </div>
    </Card>
  );
}
