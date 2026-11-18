import { Crown, Heart } from "lucide-react";
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

/** A small centred divider: a hairline with a diamond, to separate sections. */
function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-slate-700" />
      <span className="h-1.5 w-1.5 rotate-45 bg-archive-emerald/70" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-slate-700" />
    </div>
  );
}

/** One name on the roll: a leading marker and the name in serif, on a ruled row. */
function RollName({ member }: { member: Member }) {
  return (
    <li className="group flex items-baseline gap-4 border-b border-slate-800/70 py-4">
      <span
        className="h-1.5 w-1.5 shrink-0 translate-y-[-0.3em] rounded-full bg-slate-600 transition-colors group-hover:bg-archive-emerald"
        aria-hidden
      />
      <span className="font-serif text-xl text-slate-100 transition-colors group-hover:text-white sm:text-2xl">
        {member.name}
        {member.nickname && <span className="ml-2 text-base italic text-archive-emerald">“{member.nickname}”</span>}
      </span>
    </li>
  );
}

/** A tribute for a member no longer with us. */
function MemoriamCard({ member }: { member: InMemoriamMember }) {
  return (
    <li className="flex h-full flex-col items-center rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-8 text-center transition-colors hover:border-archive-emerald/40">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full border border-archive-emerald/30 bg-archive-emerald/10"
        aria-hidden
      >
        <Heart className="h-5 w-5 text-archive-emerald" />
      </span>
      <p className="mt-4 font-serif text-xl text-slate-50">{member.name}</p>
      <p className="mt-2 font-serif italic leading-relaxed text-slate-400">{member.tribute}</p>
    </li>
  );
}

export default function Members() {
  useDocumentTitle(siteContent.pageTitles.members);

  // The Deão sits at the head of the table; everyone else is listed alphabetically.
  const deao = members.find((m) => m.role);
  const turma = members
    .filter((m) => !m.role)
    .sort((a, b) => a.name.localeCompare(b.name, "pt"));

  return (
    <>
      <PageHeader title={copy.heading} intro={copy.intro} />

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <PhotoPrint photo={HERO_IMAGE} label={copy.groupPhotoCaption} className="-rotate-1" />
        </div>

        {/* ---------------------------------------------------- A Turma */}
        <div className="mt-20">
          <header className="flex flex-col items-center text-center">
            <h2 className="font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">{copy.turmaHeading}</h2>
            <p className="mt-2 text-lg text-slate-400">{copy.turmaIntro}</p>
          </header>

          <div className="mt-10 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/40 p-6 shadow-xl sm:p-10">
            {/* Deão — the head of the table */}
            {deao && (
              <div className="flex items-center gap-5 rounded-2xl border border-archive-emerald/30 bg-archive-emerald/5 px-6 py-6">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-archive-emerald/40 bg-archive-emerald/10"
                  aria-hidden
                >
                  <Crown className="h-7 w-7 text-archive-emerald" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-archive-emerald">
                    {copy.deaoLabel}
                  </p>
                  <p className="mt-1 font-serif text-2xl text-slate-50 sm:text-3xl">{deao.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{copy.deaoNote}</p>
                </div>
              </div>
            )}

            {/* The roll of members */}
            {turma.length > 0 ? (
              <ul className="mt-8 grid gap-x-12 sm:grid-cols-2">
                {turma.map((m) => (
                  <RollName key={m.id} member={m} />
                ))}
              </ul>
            ) : (
              <p className="mt-8 text-center font-serif text-xl italic leading-relaxed text-slate-400">
                {copy.empty}
              </p>
            )}

            {(deao || turma.length > 0) && (
              <p className="mt-8 text-center text-sm uppercase tracking-[0.2em] text-slate-500">
                {copy.atTable(members.length)}
              </p>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------- Em Memória */}
        {inMemoriam.length > 0 && (
          <div className="mt-24">
            <Ornament />
            <header className="mt-10 flex flex-col items-center text-center">
              <Heart className="h-7 w-7 text-archive-emerald" aria-hidden />
              <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">
                {copy.memoriamHeading}
              </h2>
              <p className="mt-2 text-lg text-slate-400">{copy.memoriamIntro}</p>
            </header>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
