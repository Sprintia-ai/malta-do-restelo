import { useState } from "react";
import { siteContent } from "@/data/timelineData";
import Lightbox, { type LightboxPhoto } from "./Lightbox";

interface Props {
  photos: LightboxPhoto[];
  emptyText?: string;
}

/** Masonry grid of photos; each opens in the lightbox. */
export default function PhotoGrid({ photos, emptyText }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  if (photos.length === 0) {
    return emptyText ? <p className="text-slate-500">{emptyText}</p> : null;
  }

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {photos.map((photo, i) => (
          <li key={photo.key} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={siteContent.a11y.openPhoto(photo.alt)}
              className="group block w-full text-left"
            >
              <span className="photo-grain relative block overflow-hidden rounded-sm border border-slate-800 bg-slate-900">
                <img
                  src={photo.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </span>
              {(photo.caption || photo.meta) && (
                <span className="mt-2 block">
                  {photo.caption && (
                    <span className="block font-serif text-sm italic text-slate-300 transition-colors group-hover:text-slate-100">
                      {photo.caption}
                    </span>
                  )}
                  {photo.meta && <span className="block text-xs text-slate-500">{photo.meta}</span>}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onIndexChange={setOpen} />
    </>
  );
}
