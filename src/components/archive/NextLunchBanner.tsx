import { Link } from "react-router-dom";
import { nextLunch, siteContent } from "@/data/timelineData";
import { formatLunchDate } from "@/lib/calendar";
import Countdown from "./Countdown";

const copy = siteContent.nextLunchPage;

/** Home band pointing to the next lunch, with a countdown once a date is set. */
export default function NextLunchBanner() {
  return (
    <section className="border-y border-slate-800/80 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">
            {copy.homeBannerHeading(nextLunch.year)}
          </h2>
          <p className="mt-3 text-slate-400">
            {nextLunch.date ? formatLunchDate(nextLunch.date) : copy.dateTbd}
            {nextLunch.venue && <>, {nextLunch.venue}</>}
          </p>
          <Link
            to="/proximo-almoco"
            className="mt-6 inline-flex rounded-md bg-archive-emerald px-5 py-2.5 text-sm font-semibold text-archive-night transition-colors hover:bg-archive-emerald-soft"
          >
            {copy.homeBannerLink}
          </Link>
        </div>
        {nextLunch.date && <Countdown date={nextLunch.date} size="md" />}
      </div>
    </section>
  );
}
