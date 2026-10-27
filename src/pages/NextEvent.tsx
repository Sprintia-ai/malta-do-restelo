import { CalendarPlus, MapPin } from "lucide-react";
import PageHeader from "@/components/archive/PageHeader";
import Countdown from "@/components/archive/Countdown";
import RsvpForm from "@/components/archive/RsvpForm";
import { nextLunch, siteContent } from "@/data/timelineData";
import { downloadIcs, formatLunchDate } from "@/lib/calendar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.nextLunchPage;

export default function NextEvent() {
  useDocumentTitle(siteContent.pageTitles.nextLunch);
  const { year, date, venue, address, mapUrl, notes } = nextLunch;
  const location = [venue, address].filter(Boolean).join(", ");

  return (
    <>
      <PageHeader
        title={copy.heading(year)}
        intro={date ? formatLunchDate(date) : copy.dateTbdBody}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {date && (
          <div className="mb-16">
            <Countdown date={date} />
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <dl className="space-y-10">
            <div>
              <dt className="text-sm text-slate-500">{copy.whenLabel}</dt>
              <dd className="mt-2 font-serif text-2xl text-slate-50">{date ? formatLunchDate(date) : copy.dateTbd}</dd>
              {date && (
                <button
                  type="button"
                  onClick={() =>
                    downloadIcs(
                      {
                        title: copy.calendarTitle(year),
                        start: date,
                        location: location || null,
                        description: notes,
                      },
                      `almoco-de-natal-${year}.ics`,
                    )
                  }
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-archive-emerald underline decoration-archive-emerald/40 underline-offset-4 hover:text-archive-emerald-soft"
                >
                  <CalendarPlus className="h-4 w-4" aria-hidden />
                  {copy.addToCalendar}
                </button>
              )}
            </div>

            <div>
              <dt className="text-sm text-slate-500">{copy.whereLabel}</dt>
              <dd className="mt-2 font-serif text-2xl text-slate-50">{venue ?? copy.venueTbd}</dd>
              {address && <dd className="mt-1 text-slate-400">{address}</dd>}
              {mapUrl && (
                <dd className="mt-4">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-archive-emerald underline decoration-archive-emerald/40 underline-offset-4 hover:text-archive-emerald-soft"
                  >
                    <MapPin className="h-4 w-4" aria-hidden />
                    {copy.openMap}
                  </a>
                </dd>
              )}
            </div>

            {notes && <p className="max-w-prose leading-relaxed text-slate-300">{notes}</p>}
          </dl>

          <RsvpForm year={year} />
        </div>
      </section>
    </>
  );
}
