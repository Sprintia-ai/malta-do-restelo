import { MapPin, UtensilsCrossed } from "lucide-react";
import PageHeader from "@/components/archive/PageHeader";
import AvailabilityPoll from "@/components/archive/AvailabilityPoll";
import RestaurantSuggestions from "@/components/archive/RestaurantSuggestions";
import { nextLunch, siteContent } from "@/data/timelineData";
import { formatLunchDate } from "@/lib/calendar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.nextLunchPage;

export default function NextEvent() {
  useDocumentTitle(siteContent.pageTitles.nextLunch);
  const { year, organizers, date, venue, address, mapUrl } = nextLunch;

  return (
    <>
      <PageHeader
        title={copy.heading(year)}
        intro={date ? formatLunchDate(date) : copy.dateTbdBody}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {organizers && (
            <div>
              <dt className="text-sm text-slate-500">{copy.organizersLabel}</dt>
              <dd className="mt-2 font-serif text-2xl text-slate-50">{organizers}</dd>
            </div>
          )}

          <div>
            <dt className="text-sm text-slate-500">{copy.mealLabel}</dt>
            <dd className="mt-2 flex items-center gap-2 font-serif text-2xl text-slate-50">
              <UtensilsCrossed className="h-5 w-5 text-archive-emerald" aria-hidden />
              {copy.meal}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">{copy.whereLabel}</dt>
            <dd className="mt-2 font-serif text-2xl text-slate-50">{venue ?? copy.venueTbd}</dd>
            {address && <dd className="mt-1 text-slate-400">{address}</dd>}
            {mapUrl && (
              <dd className="mt-3">
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

          <div>
            <dt className="text-sm text-slate-500">{copy.whenLabel}</dt>
            <dd className="mt-2 font-serif text-2xl text-slate-50">
              {date ? formatLunchDate(date) : copy.dateTbd}
            </dd>
          </div>
        </dl>
      </section>

      <AvailabilityPoll year={year} />
      <RestaurantSuggestions />
    </>
  );
}
