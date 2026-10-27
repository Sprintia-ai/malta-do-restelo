import { Link } from "react-router-dom";
import { formatEntryYear, siteContent, type TimelineEntry } from "@/data/timelineData";

/**
 * Accessible timeline, designed for readers aged 70+.
 *
 * - Warm off-white "photo album" page, near-black text (contrast well above WCAG AAA).
 * - Oversized type: body text-xl, years in a classic serif at text-5xl/6xl.
 * - Every action is a large, labelled button (px-6 py-4 minimum), never an icon alone.
 * - Completely static: no scroll animations, no fades, no hover movement, no sticky parts.
 * - One straightforward column; each lunch is its own bordered white card.
 *
 * All text comes from timelineData.ts.
 */

interface Props {
  id: string;
  entries: TimelineEntry[];
  heading: string;
  intro?: string;
  /** Optional link shown under the last card. */
  moreLink?: { to: string; label: string };
  /** Where "Adicionar Nova Fotografia" goes for lunches without a confirmed year. */
  uploadHref?: string;
}

const copy = siteContent.timeline;

/* Classic, highly readable serif for years and headings (installed on every computer). */
const serif = "[font-family:Georgia,Cambria,'Times_New_Roman',serif]";

/* A thick, unmistakable keyboard focus ring, shared by every control. */
const focusRing =
  "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-slate-900";

/* Primary action: deep burgundy with white text (contrast about 10:1). */
const primaryButton = `inline-flex items-center justify-center rounded-lg bg-[#7A1F2B] px-6 py-4 text-xl font-semibold text-white hover:bg-[#5E1621] ${focusRing}`;

/* Secondary action: white with a heavy dark border. */
const secondaryButton = `inline-flex items-center justify-center rounded-lg border-2 border-slate-900 bg-white px-6 py-4 text-xl font-semibold text-slate-900 hover:bg-stone-100 ${focusRing}`;

/** Renders an in-page anchor as <a>, a route as <Link>. */
function ActionLink({ to, className, children }: { to: string; className: string; children: string }) {
  if (to.startsWith("#")) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

function MemoryCard({ entry, uploadHref }: { entry: TimelineEntry; uploadHref: string }) {
  const headingId = `${entry.id}-titulo`;
  const isUnknownYear = entry.year === null;
  const [lead, ...rest] = entry.photos;
  const addPhotoTarget = entry.year === null ? uploadHref : `/almoco/${entry.year}#${siteContent.upload.anchorId}`;

  return (
    <article
      id={entry.id}
      aria-labelledby={headingId}
      className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-sm sm:p-10"
    >
      <header>
        <p
          className={
            isUnknownYear
              ? `${serif} text-2xl text-slate-800`
              : `${serif} text-5xl font-bold leading-none text-slate-900 sm:text-6xl`
          }
        >
          {formatEntryYear(entry.year)}
        </p>
        <h3 id={headingId} className={`${serif} mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl`}>
          {entry.title}
        </h3>
        {entry.venue && <p className="mt-3 text-xl text-slate-800">{entry.venue}</p>}
      </header>

      {lead ? (
        <figure className="mt-8">
          <img
            src={lead.src}
            alt={lead.alt}
            loading="lazy"
            decoding="async"
            className="w-full rounded-lg border-2 border-slate-200 object-cover"
          />
          <figcaption className="mt-4 text-lg leading-relaxed text-slate-800">{lead.caption}</figcaption>
        </figure>
      ) : (
        <p className="mt-8 rounded-lg border-2 border-dashed border-slate-300 bg-stone-50 px-6 py-8 text-xl text-slate-800">
          {copy.noPhotoYet}
        </p>
      )}

      {rest.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rest.map((photo) => (
            <li key={photo.src}>
              <figure>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-lg border-2 border-slate-200 object-cover"
                />
                <figcaption className="mt-3 text-lg leading-relaxed text-slate-800">{photo.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 max-w-prose text-xl leading-relaxed text-slate-900">{entry.story ?? entry.summary}</p>

      {entry.photos.length > 0 && (
        <p className="mt-4 text-lg text-slate-800">{copy.photoCount(entry.photos.length)}</p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <ActionLink to={addPhotoTarget} className={primaryButton}>
          {copy.addPhoto}
        </ActionLink>
        {entry.year !== null && (
          <ActionLink to={`/almoco/${entry.year}`} className={secondaryButton}>
            {copy.viewLunchYear(entry.year)}
          </ActionLink>
        )}
      </div>
    </article>
  );
}

export default function Timeline({
  id,
  entries,
  heading,
  intro,
  moreLink,
  uploadHref = `#${siteContent.upload.anchorId}`,
}: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="bg-stone-50 py-16 text-xl text-slate-900 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="border-b-2 border-slate-300 pb-10">
          <h2 id={`${id}-titulo`} className={`${serif} text-4xl font-bold leading-tight text-slate-900 sm:text-5xl`}>
            {heading}
          </h2>
          {intro && <p className="mt-5 max-w-prose text-xl leading-relaxed text-slate-800">{intro}</p>}
          <div className="mt-8">
            <ActionLink to={uploadHref} className={primaryButton}>
              {copy.addPhoto}
            </ActionLink>
          </div>
        </header>

        <ol className="mt-12 flex flex-col gap-12">
          {entries.map((entry) => (
            <li key={entry.id}>
              <MemoryCard entry={entry} uploadHref={uploadHref} />
            </li>
          ))}
        </ol>

        {moreLink && (
          <div className="mt-12">
            <ActionLink to={moreLink.to} className={secondaryButton}>
              {moreLink.label}
            </ActionLink>
          </div>
        )}
      </div>
    </section>
  );
}
