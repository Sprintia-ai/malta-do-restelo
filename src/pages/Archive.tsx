import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "@/components/archive/PageHeader";
import FilterChips, { type FilterOption } from "@/components/archive/FilterChips";
import {
  FOUNDING_YEAR,
  currentYear,
  decadeOf,
  documentedYears,
  getAllYears,
  getDecades,
  getEntryByYear,
  noLunchYears,
  siteContent,
  undatedEntries,
} from "@/data/timelineData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.archive;

function YearTile({ year }: { year: number }) {
  const entry = getEntryByYear(year);
  const thumb = entry?.photos[0];

  if (!entry && noLunchYears[year]) {
    return (
      <Link
        to={`/almoco/${year}`}
        className="group flex aspect-square flex-col justify-between rounded-sm border border-dashed border-slate-700 p-3 transition-colors hover:border-slate-500"
        aria-label={`${year}: ${copy.noLunch}`}
      >
        <span className="font-serif text-2xl text-slate-500 line-through decoration-slate-600 sm:text-3xl">{year}</span>
        <span className="text-xs text-slate-500">{copy.noLunch}</span>
      </Link>
    );
  }

  if (!entry) {
    return (
      <Link
        to={`/almoco/${year}`}
        className="group flex aspect-square flex-col justify-between rounded-sm border border-slate-800/80 p-3 transition-colors hover:border-slate-600"
        aria-label={`${year}: ${copy.undocumented}`}
      >
        <span className="font-serif text-2xl text-slate-600 transition-colors group-hover:text-slate-300 sm:text-3xl">
          {year}
        </span>
        <span className="text-xs text-slate-700 transition-colors group-hover:text-slate-500">{copy.undocumented}</span>
      </Link>
    );
  }

  return (
    <Link
      to={`/almoco/${year}`}
      className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-sm border border-archive-emerald/60 p-3 transition-colors hover:border-archive-emerald"
      aria-label={`${year}: ${entry.title}`}
    >
      {thumb && (
        <>
          <img
            src={thumb.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity duration-300 group-hover:opacity-70"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-archive-night/90 to-archive-night/20" aria-hidden />
        </>
      )}
      <span className="relative font-serif text-2xl font-semibold text-archive-emerald sm:text-3xl">{year}</span>
      <span className="relative line-clamp-2 text-xs leading-snug text-slate-200">{entry.title}</span>
    </Link>
  );
}

export default function Archive() {
  useDocumentTitle(siteContent.pageTitles.archive);
  const [decade, setDecade] = useState<string>("all");

  const years = getAllYears();
  const documented = documentedYears();
  const undated = undatedEntries();

  const options: FilterOption<string>[] = useMemo(
    () => [
      { value: "all", label: copy.allDecades },
      ...getDecades().map((d) => ({ value: String(d), label: copy.decadeLabel(d) })),
    ],
    [],
  );

  const visible = decade === "all" ? years : years.filter((y) => decadeOf(y) === Number(decade));

  return (
    <>
      <PageHeader
        title={copy.heading}
        intro={copy.intro(FOUNDING_YEAR, currentYear())}
        aside={
          <p className="text-slate-400">
            <span className="block font-serif text-6xl font-semibold text-archive-emerald">{documented.size}</span>
            {copy.documentedCount(documented.size, years.length)}
          </p>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <FilterChips label={copy.heading} options={options} value={decade} onChange={setDecade} />

        <motion.ul layout className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-8">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((year) => (
              <motion.li
                key={year}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2 }}
              >
                <YearTile year={year} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>

      {undated.length > 0 && (
        <section className="border-t border-slate-800/80">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold text-slate-50">{copy.unknownHeading}</h2>
            <p className="mt-3 max-w-2xl text-slate-400">{copy.unknownIntro}</p>

            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {undated.map((entry) => (
                <li key={entry.id}>
                  <Link to="/arquivo" className="group block">
                    {entry.photos[0] && (
                      <span className="photo-grain relative block overflow-hidden rounded-sm border border-slate-800">
                        <img
                          src={entry.photos[0].src}
                          alt={entry.photos[0].alt}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </span>
                    )}
                    <span className="mt-4 block font-serif text-xl text-slate-100 transition-colors group-hover:text-archive-emerald">
                      {entry.title}
                    </span>
                    {entry.notes && <span className="mt-1 block text-sm text-slate-400">{entry.notes}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
