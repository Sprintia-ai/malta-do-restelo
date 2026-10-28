import { Heart } from "lucide-react";
import PageHeader from "@/components/archive/PageHeader";
import PhotoPrint from "@/components/archive/PhotoPrint";
import { ABOUT_IMAGE, inMemoriam, siteContent } from "@/data/timelineData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.about;

export default function About() {
  useDocumentTitle(siteContent.pageTitles.about);

  return (
    <>
      <PageHeader title={copy.heading} intro={copy.subheading} />

      <section className="mx-auto grid max-w-6xl gap-16 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-24">
        <div className="max-w-prose space-y-6 text-lg leading-relaxed text-slate-300">
          <p className="font-serif text-2xl leading-snug text-slate-50 sm:text-3xl">{copy.intro[0]}</p>
          {copy.intro.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="lg:pt-4">
          <PhotoPrint photo={ABOUT_IMAGE} label={ABOUT_IMAGE.caption} className="rotate-2" />
        </div>
      </section>

      {inMemoriam.length > 0 && (
        <section className="border-t border-slate-800/80 bg-slate-950">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <div className="flex items-start gap-4">
              <Heart className="mt-1 h-7 w-7 shrink-0 text-archive-emerald" aria-hidden />
              <p className="text-lg leading-relaxed text-slate-300">{copy.memoriamLead}</p>
            </div>
            <ul className="mt-10 space-y-5">
              {inMemoriam.map((member) => (
                <li
                  key={member.id}
                  className="rounded-sm border-l-2 border-archive-emerald/70 bg-slate-900/40 py-4 pl-6 pr-4"
                >
                  <p className="font-serif text-2xl text-slate-50">{member.name}</p>
                  <p className="mt-1 font-serif italic leading-relaxed text-slate-400">{member.tribute}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">{copy.commitmentHeading}</h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300">{copy.commitment}</p>
        </div>
      </section>
    </>
  );
}
