import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/archive/PageHeader";
import PhotoGrid from "@/components/archive/PhotoGrid";
import PhotoDropzone from "@/components/archive/PhotoDropzone";
import {
  getAdjacentYears,
  getEntryByYear,
  isValidLunchYear,
  siteContent,
} from "@/data/timelineData";
import { listPhotosForYear } from "@/lib/supabase";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import NotFound from "./NotFound";

const copy = siteContent.lunch;

function YearNav({ year }: { year: number }) {
  const { previous, next } = getAdjacentYears(year);
  const linkClass =
    "group inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-archive-emerald";
  return (
    <nav aria-label={`${copy.previous} / ${copy.next}`} className="mx-auto flex max-w-6xl items-center justify-between px-4 py-12 sm:px-6">
      {previous ? (
        <Link to={`/almoco/${previous}`} className={linkClass}>
          <ChevronLeft className="h-4 w-4" aria-hidden />
          <span className="sr-only">{copy.previous}: </span>
          <span className="font-serif text-2xl">{previous}</span>
        </Link>
      ) : (
        <span />
      )}
      <Link to="/arquivo" className="text-sm text-slate-500 underline underline-offset-4 hover:text-slate-200">
        {copy.backToArchive}
      </Link>
      {next ? (
        <Link to={`/almoco/${next}`} className={linkClass}>
          <span className="sr-only">{copy.next}: </span>
          <span className="font-serif text-2xl">{next}</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

function LunchPage({ year }: { year: number }) {
  useDocumentTitle(siteContent.pageTitles.lunch(year));
  const entry = getEntryByYear(year);
  const { session } = useSupabaseSession();

  const memberPhotos = useQuery({
    queryKey: ["archive-photos", String(year)],
    queryFn: async () => {
      const r = await listPhotosForYear(year);
      if (!r.ok) throw new Error(r.code);
      return r.data;
    },
    enabled: Boolean(session),
  });

  const staticPhotos = (entry?.photos ?? []).map((p, i) => ({
    key: `${entry!.id}-${i}`,
    src: p.src,
    alt: p.alt,
    caption: p.caption,
    meta: p.credit,
  }));

  const uploaded = (memberPhotos.data ?? []).map((p) => ({ key: p.path, src: p.url, alt: p.name }));

  return (
    <>
      <PageHeader
        title={entry?.title ?? copy.undocumentedHeading}
        intro={entry ? (entry.story ?? entry.summary) : copy.undocumentedBody}
        aside={
          <p aria-hidden className="font-serif text-[7rem] font-semibold leading-none text-archive-emerald sm:text-[10rem]">
            {year}
          </p>
        }
      >
        {entry?.venue && <p className="mt-4 text-slate-300">{entry.venue}</p>}
      </PageHeader>

      {staticPhotos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 font-serif text-3xl font-semibold text-slate-50">{copy.photosHeading}</h2>
          <PhotoGrid photos={staticPhotos} />
        </section>
      )}

      {uploaded.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 font-serif text-3xl font-semibold text-slate-50">{copy.memberPhotosHeading}</h2>
          <PhotoGrid photos={uploaded} />
        </section>
      )}

      <PhotoDropzone
        fixedYear={year}
        showGallery={false}
        heading={siteContent.upload.heading}
        intro={siteContent.upload.intro}
      />

      <div className="border-t border-slate-800/80">
        <YearNav year={year} />
      </div>
    </>
  );
}

export default function Event() {
  const { year: param } = useParams();
  const year = Number(param);
  if (!param || !isValidLunchYear(year)) return <NotFound message={copy.invalidYear} />;
  // key resets state (queries, uploads) when moving between years
  return <LunchPage key={year} year={year} />;
}
