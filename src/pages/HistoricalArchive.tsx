import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Camera } from "lucide-react";
import PageHeader from "@/components/archive/PageHeader";
import {
  formatEntryYear,
  siteContent,
  timelineEntries,
  type TimelineEntry,
} from "@/data/timelineData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.history;

/** One entry; reports itself as active when it crosses the middle of the screen. */
function HistoryEntry({ entry, onActive }: { entry: TimelineEntry; onActive: (id: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(entry.id);
  }, [inView, entry.id, onActive]);

  const lead = entry.photos[0];

  return (
    <article ref={ref} id={entry.id} className="scroll-mt-28 border-t border-slate-800 py-14 first:border-t-0 first:pt-0">
      {/* Year shown inline on small screens; the sticky column takes over on large ones */}
      <p
        className={`mb-3 font-serif lg:hidden ${
          entry.year === null ? "text-lg italic text-slate-500" : "text-4xl font-semibold text-archive-emerald"
        }`}
      >
        {formatEntryYear(entry.year)}
      </p>

      <h2 className="font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">{entry.title}</h2>
      {entry.venue && <p className="mt-2 text-slate-400">{entry.venue}</p>}
      <p className="mt-5 max-w-prose text-lg leading-relaxed text-slate-300">{entry.story ?? entry.summary}</p>

      {lead && (
        <figure className="mt-8">
          <div className="photo-grain relative overflow-hidden rounded-sm border border-slate-800 bg-slate-900 shadow-photo">
            <img src={lead.src} alt={lead.alt} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
          </div>
          <figcaption className="mt-3 font-serif text-sm italic text-slate-400">{lead.caption}</figcaption>
        </figure>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
        {entry.photos.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <Camera className="h-3.5 w-3.5" aria-hidden />
            {siteContent.timeline.photoCount(entry.photos.length)}
          </span>
        )}
        {entry.year !== null && (
          <Link
            to={`/almoco/${entry.year}`}
            className="font-medium text-archive-emerald underline decoration-archive-emerald/40 underline-offset-4 hover:text-archive-emerald-soft"
          >
            {siteContent.timeline.viewLunch}
          </Link>
        )}
      </div>
    </article>
  );
}

export default function HistoricalArchive() {
  useDocumentTitle(siteContent.pageTitles.history);
  const [activeId, setActiveId] = useState(timelineEntries[0]?.id);
  const active = timelineEntries.find((e) => e.id === activeId) ?? timelineEntries[0];
  const activeLabel = active ? formatEntryYear(active.year) : "";

  return (
    <>
      <PageHeader title={copy.heading} intro={copy.intro} />

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* Sticky year: the page's signature — it changes as you scroll the lunches */}
        <aside className="hidden lg:block" aria-hidden>
          <div className="sticky top-28">
            <div className="relative h-[11rem] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={activeLabel}
                  initial={{ y: "60%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-60%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute inset-x-0 bottom-0 font-serif font-semibold leading-none tracking-tight ${
                    active?.year === null ? "text-4xl italic text-slate-500" : "text-[9rem] text-archive-emerald"
                  }`}
                >
                  {activeLabel}
                </motion.p>
              </AnimatePresence>
            </div>

            <nav aria-label={copy.heading} className="mt-10 border-l border-slate-800">
              <ul>
                {timelineEntries.map((entry) => {
                  const isActive = entry.id === activeId;
                  return (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        className={`-ml-px block border-l py-2 pl-4 text-sm transition-colors ${
                          isActive
                            ? "border-archive-emerald text-archive-emerald"
                            : "border-transparent text-slate-500 hover:text-slate-200"
                        }`}
                      >
                        <span className="font-serif">{entry.year ?? "—"}</span>
                        <span className="ml-3">{entry.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        <div>
          {timelineEntries.map((entry) => (
            <HistoryEntry key={entry.id} entry={entry} onActive={setActiveId} />
          ))}
        </div>
      </div>
    </>
  );
}
