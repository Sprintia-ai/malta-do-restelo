import PageHeader from "@/components/archive/PageHeader";
import PhotoPrint from "@/components/archive/PhotoPrint";
import { HERO_IMAGE, members, siteContent, type Member } from "@/data/timelineData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.members;

/** A member shown as a place card on the table: folded card, name in serif. */
function PlaceCard({ member }: { member: Member }) {
  return (
    <li className="group">
      <div className="relative rounded-sm border border-slate-800 bg-slate-950 px-5 pb-6 pt-8 transition-colors group-hover:border-archive-emerald/60">
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
            {member.nickname && <p className="mt-0.5 font-serif italic text-archive-emerald">{member.nickname}</p>}
            {member.since && <p className="mt-2 text-sm text-slate-500">{copy.since(member.since)}</p>}
            {member.note && <p className="mt-3 text-sm leading-relaxed text-slate-400">{member.note}</p>}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Members() {
  useDocumentTitle(siteContent.pageTitles.members);
  const sorted = [...members].sort((a, b) => (a.since ?? 9999) - (b.since ?? 9999) || a.name.localeCompare(b.name, "pt"));

  return (
    <>
      <PageHeader title={copy.heading} intro={copy.intro} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <PhotoPrint photo={HERO_IMAGE} label={copy.groupPhotoCaption} className="-rotate-1" />
        </div>

        {sorted.length > 0 ? (
          <ul className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((m) => (
              <PlaceCard key={m.id} member={m} />
            ))}
          </ul>
        ) : (
          <p className="mx-auto mt-16 max-w-xl text-center font-serif text-xl italic leading-relaxed text-slate-400">
            {copy.empty}
          </p>
        )}
      </section>
    </>
  );
}
