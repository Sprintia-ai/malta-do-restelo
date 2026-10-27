import type { ReactNode } from "react";

interface Props {
  title: string;
  intro?: ReactNode;
  /** Optional content on the right on wide screens (a big year, a stat…). */
  aside?: ReactNode;
  children?: ReactNode;
}

/** Top of every inner page. Leaves room for the fixed header. */
export default function PageHeader({ title, intro, aside, children }: Props) {
  return (
    <header className="border-b border-slate-800/80 bg-archive-night pb-14 pt-32 sm:pb-20 sm:pt-40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div>
          <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-slate-50 sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">{intro}</div>}
          {children}
        </div>
        {aside && <div className="lg:text-right">{aside}</div>}
      </div>
    </header>
  );
}
