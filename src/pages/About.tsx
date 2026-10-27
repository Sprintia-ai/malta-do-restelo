import PageHeader from "@/components/archive/PageHeader";
import PhotoPrint from "@/components/archive/PhotoPrint";
import { archiveStats, getAllStaticPhotos, siteContent } from "@/data/timelineData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.about;

export default function About() {
  useDocumentTitle(siteContent.pageTitles.about);
  const stats = archiveStats();
  const photo = getAllStaticPhotos()[0];

  const facts: Array<[string, number]> = [
    [copy.facts.since, stats.since],
    [copy.facts.years, stats.years],
    [copy.facts.documented, stats.documented],
    [copy.facts.photos, stats.photos],
  ];

  return (
    <>
      <PageHeader title={copy.heading} />

      <section className="mx-auto grid max-w-6xl gap-16 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-24">
        <div>
          <p className="font-serif text-3xl leading-snug text-slate-50 sm:text-4xl">{copy.lead}</p>
          <div className="mt-10 max-w-prose space-y-6 text-lg leading-relaxed text-slate-300">
            {copy.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        {photo && (
          <div className="lg:pt-4">
            <PhotoPrint photo={photo} className="rotate-2" />
          </div>
        )}
      </section>

      <section className="border-t border-slate-800/80">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold text-slate-50">{copy.pillarsHeading}</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {copy.pillars.map((pillar) => (
              <div key={pillar.title} className="border-t-2 border-archive-emerald pt-6">
                <h3 className="font-serif text-2xl text-slate-50">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-400">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800/80 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold text-slate-50">{copy.factsHeading}</h2>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {facts.map(([label, value]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="mt-2 text-sm text-slate-500">{label}</dt>
                <dd className="font-serif text-5xl font-semibold tabular-nums text-archive-emerald sm:text-6xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
