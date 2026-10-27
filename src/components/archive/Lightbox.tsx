import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { siteContent } from "@/data/timelineData";

export interface LightboxPhoto {
  key: string;
  src: string;
  alt: string;
  caption?: string;
  /** Small line under the caption, e.g. the year. */
  meta?: string;
}

interface Props {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const a11y = siteContent.a11y;

/** Full-screen photo viewer: arrow keys, Esc, swipe on touch, focus kept inside. */
export default function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const open = index !== null && photos[index] !== undefined;
  const count = photos.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null || count === 0) return;
      onIndexChange((index + delta + count) % count);
    },
    [index, count, onIndexChange],
  );

  // Open/close: lock page scroll, move focus in, give it back on close
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open]);

  // Keyboard: Esc closes, arrows navigate, Tab stays inside the dialog
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const dialog = closeRef.current?.closest('[role="dialog"]');
        const focusable = dialog?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) go(1);
    else if (info.offset.x > 80) go(-1);
  };

  const photo = open ? photos[index] : null;

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          className="fixed inset-0 z-[100] flex flex-col bg-archive-night/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <span className="text-sm tabular-nums text-slate-400">
              {index! + 1} / {count}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={a11y.closeLightbox}
              className="rounded-md p-2 text-slate-300 transition-colors hover:text-archive-emerald"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
            {count > 1 && (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={a11y.previousPhoto}
                className="absolute left-2 z-10 hidden rounded-full border border-slate-700 bg-archive-night/70 p-3 text-slate-200 transition-colors hover:border-archive-emerald hover:text-archive-emerald sm:block"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={photo.key}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                drag={count > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={onDragEnd}
                className="flex max-h-full max-w-5xl cursor-grab flex-col items-center active:cursor-grabbing"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  draggable={false}
                  className="max-h-[72vh] w-auto max-w-full rounded-sm object-contain shadow-photo"
                />
                {(photo.caption || photo.meta) && (
                  <figcaption className="mt-5 max-w-2xl text-center">
                    {photo.caption && <p className="font-serif text-lg italic text-slate-200">{photo.caption}</p>}
                    {photo.meta && <p className="mt-1 text-sm text-slate-500">{photo.meta}</p>}
                  </figcaption>
                )}
              </motion.figure>
            </AnimatePresence>

            {count > 1 && (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={a11y.nextPhoto}
                className="absolute right-2 z-10 hidden rounded-full border border-slate-700 bg-archive-night/70 p-3 text-slate-200 transition-colors hover:border-archive-emerald hover:text-archive-emerald sm:block"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
