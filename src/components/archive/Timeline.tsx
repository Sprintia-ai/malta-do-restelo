import { Link } from "react-router-dom";
import {
  formatEntryYear,
  formatLunchDay,
  getDecadeGroups,
  siteContent,
  type DecadeGroup,
  type TimelineEntry,
} from "@/data/timelineData";
import { LunchFacts, LunchMinutes } from "./LunchFacts";

/**
 * Accessible timeline, designed for readers aged 70+.
 *
 * - Warm off-white "photo album" page, near-black text (contrast well above WCAG AAA).
 * - Oversized type: body text-xl, years in a classic serif at text-5xl/6xl.
 * - Every action is a large, labelled button (px-6 py-4 minimum), never an icon alone.
 * - Completely static: no scroll animations, no fades, no hover movement.
 * - Grouped into one section per decade (ids "decada-1960", …) for the sticky
 *   decade menu; each lunch is its own bordered white card.
 *
 * All text comes from timelineData.ts.
 */

interface Props {
  id: string;
  entries: TimelineEntry[];
  heading: string;
  intro?: string;
  /** Optional link shown under the last section. */
  moreLink?: { to: string; label: string };
  /** Where "Adicionar Nova Fotografia" goes for lunches without a confirmed year. */
  uploadHref?: string;
}

const copy = siteContent.timeline;
const decadeCopy = siteContent.decadeMenu;

/* Classic, highly readable serif for years and headings (installed on every computer). */
const serif = "[font-family:Georgia,Cambria,'Times_New_Roman',serif]";

/* A thick, unmistakable keyboard focus ring, shared by every control. */
const focusRing =
  "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-slate-900";

/* Primary action: deep burgundy with white text (contrast about 10:1). */
const primaryButton = `inline-flex items-center justify-center rounded-lg bg-[#7A1F2B] px-6 py-4 text-xl font-semibold text-white hover:bg-[#5E1621] ${focusRing}`;

/* Secondary action: white with a heavy dark border. */
const secondaryButton = `inline-flex items-center justify-center rounded-lg border-2 border-slate-900 bg-white px-6 py-4 text-xl font-semibold text-slate-900 hover:bg-stone-100 ${focusRing}`;

/* Decade sections stop just below the sticky decade menu instead of hiding under it. */
const belowStickyMenu = { scrollMarginTop: "calc(var(--decade-menu-h, 0px) + 1rem)" };

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
      style={belowStickyMenu}
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
        <h4 id={headingId} className={`${serif} mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl`}>
          {entry.title}
        </h4>
        {entry.date && <p className="mt-3 text-xl text-slate-800">{formatLunchDay(entry.date)}</p>}
      </header>

      {lead && (
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

      <div className="mt-8">
        {entry.organizers || entry.attendees ? (
          <LunchFacts entry={entry} tone="light" showDate={false} large />
        ) : (
          // Lunches recorded only through quotes (1964) show those quotes instead
          <LunchMinutes entry={entry} tone="light" />
        )}
      </div>

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

/** One decade: a clear heading with its year range, then its memories (or an invitation if it has none). */
function DecadeSection({ group, uploadHref }: { group: DecadeGroup; uploadHref: string }) {
  const headingId = `${group.anchorId}-titulo`;

  return (
    <section id={group.anchorId} aria-labelledby={headingId} style={belowStickyMenu}>
      <header className="border-t-4 border-slate-900 pt-6">
        {/* tabIndex -1: the decade menu moves keyboard focus here after jumping */}
        <h3
          id={headingId}
          tabIndex={-1}
          data-decade-heading
          className={`${serif} text-4xl font-bold leading-tight text-slate-900 focus:outline-none sm:text-5xl`}
        >
          {group.label}
        </h3>
        <p className="mt-2 text-xl text-slate-800">
          {group.decade === null ? decadeCopy.unknownIntro : decadeCopy.yearRange(group.decade)}
        </p>
      </header>

      {group.entries.length > 0 ? (
        <ol className="mt-8 flex flex-col gap-12">
          {group.entries.map((entry) => (
            <li key={entry.id}>
              <MemoryCard entry={entry} uploadHref={uploadHref} />
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-8 rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 sm:p-8">
          <p className="max-w-prose text-xl leading-relaxed text-slate-900">{decadeCopy.emptyDecade}</p>
          <div className="mt-6">
            <ActionLink to={uploadHref} className={primaryButton}>
              {copy.addPhoto}
            </ActionLink>
          </div>
        </div>
      )}
    </section>
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
  const groups = getDecadeGroups(entries);

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="bg-stone-50 py-16 text-xl text-slate-900 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="pb-10">
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

        <div className="flex flex-col gap-16">
          {groups.map((group) => (
            <DecadeSection key={group.anchorId} group={group} uploadHref={uploadHref} />
          ))}
        </div>

        {moreLink && (
          <div className="mt-16">
            <ActionLink to={moreLink.to} className={secondaryButton}>
              {moreLink.label}
            </ActionLink>
          </div>
        )}
      </div>
    </section>
  );
}
