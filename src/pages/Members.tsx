import { Heart } from "lucide-react";
import PageHeader from "@/components/archive/PageHeader";
import PhotoPrint from "@/components/archive/PhotoPrint";
import {
  HERO_IMAGE,
  inMemoriam,
  members,
  siteContent,
  type InMemoriamMember,
  type Member,
} from "@/data/timelineData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.members;

/** A member shown as a place card on the table: folded card, name in serif. */
function PlaceCard({ member }: { member: Member }) {
  return (
    <li className="group">
      <div className="relative h-full rounded-sm border border-slate-800 bg-slate-950 px-5 pb-6 pt-8 transition-colors group-hover:border-archive-emerald/60">
        {/* The fold of a place card */}
        <span className="absolute inset-x-0 top-3 h-px bg-slate-800 transition-colors group-hover:bg-archive-emerald/40" aria-hidden />
        <div className="flex items-start gap-4">
          {member.photo && (
            <img
              src={member.photo}
              alt=""
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-full object-cover grayscale transition group-hover:grayscale-0"
            />
          )}
          <div className="min-w-0">
            <p className="font-serif text-xl leading-snug text-slate-50">{member.name}</p>
            {member.role && (
              <p className="mt-1 inline-block rounded-full bg-archive-emerald/15 px-2.5 py-0.5 text-sm font-semibold text-archive-emerald">
                {member.role}
              </p>
            )}
            {member.nickname && <p className="mt-0.5 font-serif italic text-archive-emerald">{member.nickname}</p>}
            {member.since && <p className="mt-2 text-sm text-slate-500">{copy.since(member.since)}</p>}
            {member.note && <p className="mt-3 text-sm leading-relaxed text-slate-400">{member.note}</p>}
          </div>
        </div>
      </div>
    </li>
  );
}

/** A tribute card for a member no longer with us. */
function MemoriamCard({ member }: { member: InMemoriamMember }) {
  return (
    <li className="flex h-full flex-col items-center rounded-sm border border-slate-800 bg-slate-950 px-5 py-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-archive-emerald/30 bg-archive-emerald/10" aria-hidden>
        <Heart className="h-6 w-6 text-archive-emerald" />
      </span>
      <p className="mt-4 font-serif text-xl text-slate-50">{member.name}</p>
      <p className="mt-2 font-serif italic leading-relaxed text-slate-400">{member.tribute}</p>
    </li>
  );
}

export default function Members() {
  useDocumentTitle(siteContent.pageTitles.members);

  // The Deão comes first; everyone else alphabetically.
  const turma = [...members].sort((a, b) => {
    if (a.role && !b.role) return -1;
    if (b.role && !a.role) return 1;
    return a.name.localeCompare(b.name, "pt");
  });

  return (
    <>
      <PageHeader title={copy.heading} intro={copy.intro} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <PhotoPrint photo={HERO_IMAGE} label={copy.groupPhotoCaption} className="-rotate-1" />
        </div>

        {turma.length > 0 ? (
          <div className="mt-20">
            <header className="mb-8">
              <h2 className="font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">{copy.turmaHeading}</h2>
              <p className="mt-2 text-lg text-slate-400">{copy.turmaIntro}</p>
            </header>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {turma.map((m) => (
                <PlaceCard key={m.id} member={m} />
              ))}
            </ul>
          </div>
        ) : (
          <p className="mx-auto mt-16 max-w-xl text-center font-serif text-xl italic leading-relaxed text-slate-400">
            {copy.empty}
          </p>
        )}

        {inMemoriam.length > 0 && (
          <div className="mt-20 border-t border-slate-800/80 pt-16">
            <header className="mb-8 flex flex-col items-center text-center">
              <Heart className="h-7 w-7 text-archive-emerald" aria-hidden />
              <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">{copy.memoriamHeading}</h2>
              <p className="mt-2 text-lg text-slate-400">{copy.memoriamIntro}</p>
            </header>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inMemoriam.map((m) => (
                <MemoriamCard key={m.id} member={m} />
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
