import type { TimelinePhoto } from "@/data/timelineData";

interface Props {
  photo: TimelinePhoto;
  /** Optional line written on the print's bottom margin, e.g. the year. */
  label?: string;
  className?: string;
}

/** A photo presented as a physical print: off-white border, wider bottom margin. */
export default function PhotoPrint({ photo, label, className = "" }: Props) {
  return (
    <figure
      className={`bg-[#ECE9E2] p-2.5 pb-10 shadow-photo sm:p-3 sm:pb-12 ${className}`}
    >
      <div className="photo-grain relative overflow-hidden bg-slate-900">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover saturate-[0.9]"
        />
      </div>
      <figcaption className="mt-3 px-1 font-serif text-sm italic leading-snug text-slate-700">
        {label ?? photo.caption}
      </figcaption>
    </figure>
  );
}
