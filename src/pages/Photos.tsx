import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/archive/PageHeader";
import PhotoGrid from "@/components/archive/PhotoGrid";
import FilterChips, { type FilterOption } from "@/components/archive/FilterChips";
import PhotoDropzone from "@/components/archive/PhotoDropzone";
import type { LightboxPhoto } from "@/components/archive/Lightbox";
import { formatEntryYear, getAllStaticPhotos, siteContent } from "@/data/timelineData";
import { listAllPhotos } from "@/lib/supabase";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.photos;
const UNKNOWN = "sem-ano";

type YearPhoto = LightboxPhoto & { yearKey: string };

const yearKey = (year: number | null) => (year === null ? UNKNOWN : String(year));

export default function Photos() {
  useDocumentTitle(siteContent.pageTitles.photos);
  const { session, configured } = useSupabaseSession();
  const [filter, setFilter] = useState("all");

  const staticPhotos: YearPhoto[] = useMemo(
    () =>
      getAllStaticPhotos().map((p) => ({
        key: p.key,
        src: p.src,
        alt: p.alt,
        caption: p.caption,
        meta: `${p.entryTitle} (${formatEntryYear(p.year)})`,
        yearKey: yearKey(p.year),
      })),
    [],
  );

  const memberQuery = useQuery({
    queryKey: ["archive-photos", "all"],
    queryFn: async () => {
      const r = await listAllPhotos();
      if (!r.ok) throw new Error(r.code);
      return r.data;
    },
    enabled: Boolean(session),
    staleTime: 5 * 60 * 1000,
  });

  const memberPhotos: YearPhoto[] = useMemo(
    () =>
      (memberQuery.data ?? []).map((p) => ({
        key: p.path,
        src: p.url,
        alt: p.name,
        meta: formatEntryYear(p.year),
        yearKey: yearKey(p.year),
      })),
    [memberQuery.data],
  );

  // Filter options: every year that has at least one photo, oldest first, unknown last
  const options: FilterOption<string>[] = useMemo(() => {
    const keys = new Set([...staticPhotos, ...memberPhotos].map((p) => p.yearKey));
    const years = [...keys].filter((k) => k !== UNKNOWN).sort();
    return [
      { value: "all", label: copy.filterAll },
      ...years.map((y) => ({ value: y, label: y })),
      ...(keys.has(UNKNOWN) ? [{ value: UNKNOWN, label: siteContent.timeline.unknownYear }] : []),
    ];
  }, [staticPhotos, memberPhotos]);

  const byFilter = (list: YearPhoto[]) => (filter === "all" ? list : list.filter((p) => p.yearKey === filter));

  return (
    <>
      <PageHeader title={copy.heading} intro={copy.intro} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {options.length > 2 && (
          <div className="mb-10">
            <FilterChips label={copy.heading} options={options} value={filter} onChange={setFilter} />
          </div>
        )}

        <PhotoGrid photos={byFilter(staticPhotos)} emptyText={copy.empty} />

        {configured && (
          <div className="mt-20 border-t border-slate-800 pt-14">
            <h2 className="font-serif text-3xl font-semibold text-slate-50">{copy.memberPhotosHeading}</h2>
            {!session ? (
              <p className="mt-4 text-slate-400">
                {copy.memberPhotosSignedOut}{" "}
                <Link
                  to="/auth?next=/fotografias"
                  className="text-archive-emerald underline underline-offset-4 hover:text-archive-emerald-soft"
                >
                  {siteContent.upload.signInCta}
                </Link>
              </p>
            ) : memberQuery.isLoading ? (
              <Loader2 className="mt-6 h-5 w-5 animate-spin text-archive-emerald" aria-hidden />
            ) : memberQuery.isError ? (
              <p className="mt-4 text-amber-400">{siteContent.upload.errors["list-failed"]}</p>
            ) : (
              <div className="mt-8">
                <PhotoGrid photos={byFilter(memberPhotos)} emptyText={copy.empty} />
              </div>
            )}
          </div>
        )}
      </section>

      <PhotoDropzone showGallery={false} />
    </>
  );
}
