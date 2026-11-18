import { ExternalLink } from "lucide-react";
import { mandarimMenu, siteContent } from "@/data/timelineData";

const copy = siteContent.nextLunchPage.menu;

/** The Estoril Mandarim menu — an indicative à-la-carte selection, shown as a printed card. */
export default function MandarimMenu() {
  return (
    <section aria-labelledby="ementa-titulo" className="mx-auto max-w-5xl px-4 pb-4 sm:px-6">
      <header className="mb-8">
        <h2 id="ementa-titulo" className="font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">
          {copy.heading}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-400">{copy.intro}</p>
      </header>

      <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/40 p-6 shadow-xl sm:p-10">
        <div className="grid gap-x-14 gap-y-10 sm:grid-cols-2">
          {mandarimMenu.sections.map((section) => (
            <div key={section.heading}>
              <h3 className="flex items-center gap-3 font-serif text-xl text-archive-emerald">
                <span className="h-1.5 w-1.5 rotate-45 bg-archive-emerald/70" aria-hidden />
                {section.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item.name} className="border-b border-slate-800/60 pb-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-serif text-lg text-slate-100">{item.name}</p>
                      {item.price && (
                        <span className="shrink-0 font-serif text-base tabular-nums text-archive-emerald">
                          {item.price}
                        </span>
                      )}
                    </div>
                    {item.note && <p className="mt-0.5 text-sm italic text-slate-500">{item.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">{copy.note}</p>
          <a
            href={mandarimMenu.link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-archive-emerald underline decoration-archive-emerald/40 underline-offset-4 hover:text-archive-emerald-soft"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            {mandarimMenu.link.label}
          </a>
        </div>
      </div>
    </section>
  );
}
