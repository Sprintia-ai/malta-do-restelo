import { formatLunchDay, siteContent, type TimelineEntry } from "@/data/timelineData";

/**
 * The recorded details of one lunch (Data, Organização, Presenças, Ementa, Bebidas,
 * Observações), shown with the same labels as the group's own records.
 * `tone` matches the page: "light" for the photo-album timeline, "dark" elsewhere.
 */

const labels = siteContent.lunchFacts;

type Tone = "light" | "dark";

const toneClasses: Record<Tone, { label: string; value: string; rule: string; quote: string }> = {
  light: {
    label: "text-slate-800",
    value: "text-slate-900",
    rule: "border-slate-200",
    quote: "border-slate-900 text-slate-900",
  },
  dark: {
    label: "text-slate-400",
    value: "text-slate-100",
    rule: "border-slate-800",
    quote: "border-archive-emerald text-slate-200",
  },
};

interface FactsProps {
  entry: TimelineEntry;
  tone?: Tone;
  /** Leave out the date when the page already shows it prominently. */
  showDate?: boolean;
  /** Only these fields (default: all that the entry has). */
  only?: Array<"date" | "organizers" | "attendees" | "menu" | "drinks" | "menuAndDrinks" | "notes">;
  /** Larger text for the 70+ photo-album timeline. */
  large?: boolean;
}

export function LunchFacts({ entry, tone = "dark", showDate = true, only, large = false }: FactsProps) {
  const c = toneClasses[tone];
  const want = (key: NonNullable<FactsProps["only"]>[number]) => !only || only.includes(key);

  const rows: Array<{ key: string; label: string; value: string | string[] }> = [];
  if (showDate && want("date") && entry.date) rows.push({ key: "date", label: labels.date, value: formatLunchDay(entry.date) });
  if (want("organizers") && entry.organizers) rows.push({ key: "organizers", label: labels.organizers, value: entry.organizers });
  if (want("attendees") && entry.attendees) rows.push({ key: "attendees", label: labels.attendees, value: entry.attendees });
  if (want("menu") && entry.menu?.length) rows.push({ key: "menu", label: labels.menu, value: entry.menu });
  if (want("drinks") && entry.drinks?.length) rows.push({ key: "drinks", label: labels.drinks, value: entry.drinks });
  if (want("menuAndDrinks") && entry.menuAndDrinks)
    rows.push({ key: "menuAndDrinks", label: labels.menuAndDrinks, value: entry.menuAndDrinks });
  if (want("notes") && entry.notes) rows.push({ key: "notes", label: labels.notes, value: entry.notes });

  if (rows.length === 0) return null;

  const labelSize = large ? "text-lg font-bold" : "text-sm font-semibold";
  const valueSize = large ? "text-xl" : "text-base";

  return (
    <dl className={`divide-y ${c.rule} border-y ${c.rule}`}>
      {rows.map((row) => (
        <div key={row.key} className="grid gap-1 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
          <dt className={`${labelSize} ${c.label}`}>{row.label}</dt>
          <dd className={`${valueSize} leading-relaxed ${c.value}`}>
            {Array.isArray(row.value) ? (
              <ul className="space-y-1">
                {row.value.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** The acta (minutes) of a lunch, paragraph by paragraph, word for word. */
export function LunchMinutes({ entry, tone = "dark" }: { entry: TimelineEntry; tone?: Tone }) {
  if (!entry.minutes?.length) return null;
  const c = toneClasses[tone];
  // The 1964 entry quotes two excerpts from the 2009 acta rather than a whole acta of its own
  const isExcerpt = entry.year !== null && entry.source !== undefined && entry.source !== `Acta ${entry.year}`;

  return (
    <figure>
      <blockquote className={`space-y-4 border-l-4 pl-5 text-lg leading-relaxed ${c.quote}`}>
        {entry.minutes.map((paragraph, i) => {
          // Lettered sub-items ("a.  Manter o Pai Gaspar…") are indented under their point
          const isSubItem = /^[a-z]\.\s/.test(paragraph);
          return (
            <p key={i} className={`${isSubItem ? "pl-6" : ""} max-w-prose`}>
              {isExcerpt ? `«…${paragraph}…»` : paragraph}
            </p>
          );
        })}
      </blockquote>
      {entry.source && (
        <figcaption className={`mt-4 pl-5 text-sm ${c.label}`}>{labels.source(entry.source)}</figcaption>
      )}
    </figure>
  );
}
