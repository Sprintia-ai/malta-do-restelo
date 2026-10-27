import { useCallback, useEffect, useId, useRef, useState, type DragEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ImagePlus, Loader2, LogOut, XCircle } from "lucide-react";
import {
  formatEntryYear,
  getSelectableYears,
  siteContent,
  type UploadErrorCode,
} from "@/data/timelineData";
import {
  ACCEPTED_IMAGE_TYPES,
  listPhotosForYear,
  signOut,
  uploadPhoto,
  validateImageFile,
} from "@/lib/supabase";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

type QueueStatus = "uploading" | "done" | "error";

interface QueueItem {
  id: string;
  name: string;
  preview: string;
  status: QueueStatus;
  error?: UploadErrorCode;
}

const copy = siteContent.upload;
const UNKNOWN = "sem-ano";

const parseYear = (value: string): number | null => (value === UNKNOWN ? null : Number(value));

interface Props {
  /** Lock uploads to one year (the per-year page). `null` = year unknown. Omit to show the year selector. */
  fixedYear?: number | null;
  /** Show the photos already uploaded for the selected year. */
  showGallery?: boolean;
  heading?: string;
  intro?: string;
}

const toYearValue = (year: number | null): string => (year === null ? UNKNOWN : String(year));

export default function PhotoDropzone({
  fixedYear,
  showGallery = true,
  heading = copy.heading,
  intro = copy.intro,
}: Props = {}) {
  const { session, loading, configured } = useSupabaseSession();
  const location = useLocation();
  const yearIsFixed = fixedYear !== undefined;
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewsRef = useRef<string[]>([]);
  const selectId = useId();

  const [yearValue, setYearValue] = useState<string>(() =>
    yearIsFixed ? toYearValue(fixedYear) : String(new Date().getFullYear()),
  );
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const year = parseYear(yearValue);
  const yearLabel = formatEntryYear(year);

  // Release object URLs when the component unmounts
  useEffect(() => () => previewsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const gallery = useQuery({
    queryKey: ["archive-photos", yearValue],
    queryFn: async () => {
      const result = await listPhotosForYear(year);
      if (!result.ok) throw new Error(result.code);
      return result.data;
    },
    enabled: Boolean(session) && showGallery,
    staleTime: 5 * 60 * 1000,
  });

  const updateItem = (id: string, patch: Partial<QueueItem>) =>
    setQueue((q) => q.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);

      const items: QueueItem[] = files.map((file) => {
        const preview = URL.createObjectURL(file);
        previewsRef.current.push(preview);
        return {
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          preview,
          status: "uploading",
        };
      });
      setQueue((q) => [...items, ...q]);

      // Sequential uploads: gentler on mobile connections and keeps order predictable
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        const item = items[i];

        const valid = validateImageFile(file);
        if (!valid.ok) {
          updateItem(item.id, { status: "error", error: valid.code });
          continue;
        }

        const result = await uploadPhoto(file, year);
        updateItem(
          item.id,
          result.ok ? { status: "done" } : { status: "error", error: result.code },
        );
      }

      queryClient.invalidateQueries({ queryKey: ["archive-photos"] });
    },
    [queryClient, year],
  );

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragging(false);
    void handleFiles(e.dataTransfer.files);
  };

  return (
    <section
      id={copy.anchorId}
      className="relative scroll-mt-16 border-t border-slate-800/80 bg-archive-night py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-12">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-slate-400">{intro}</p>
        </header>

        {!configured ? (
          <p className="rounded-md border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
            {copy.errors["not-configured"]}
          </p>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-archive-emerald" aria-hidden />
          </div>
        ) : !session ? (
          <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
            <p className="text-slate-300">{copy.signInPrompt}</p>
            <Link
              to={`/auth?next=${encodeURIComponent(location.pathname)}`}
              className="mt-6 inline-flex items-center rounded-md bg-archive-emerald px-5 py-2.5 text-sm font-semibold text-archive-night transition-all hover:bg-archive-emerald-soft hover:shadow-emerald-glow"
            >
              {copy.signInCta}
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Session bar + year selector */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {yearIsFixed ? (
                <p className="font-serif text-xl text-slate-200">{yearLabel}</p>
              ) : (
              <div>
                <label
                  htmlFor={selectId}
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                >
                  {copy.yearLabel}
                </label>
                <select
                  id={selectId}
                  value={yearValue}
                  onChange={(e) => setYearValue(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 transition-colors focus:border-archive-emerald focus:outline-none focus:ring-1 focus:ring-archive-emerald sm:w-56"
                >
                  {getSelectableYears().map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                  <option value={UNKNOWN}>{copy.unknownYearOption}</option>
                </select>
              </div>
              )}

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="truncate">{copy.signedInAs(session.user.email ?? "")}</span>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-slate-300 transition-colors hover:text-archive-emerald"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  {copy.signOut}
                </button>
              </div>
            </div>

            {/* Dropzone */}
            <motion.button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
              }}
              onDrop={onDrop}
              animate={{ scale: dragging ? 1.01 : 1 }}
              transition={{ duration: 0.2 }}
              className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-14 text-center transition-colors duration-200 ${
                dragging
                  ? "border-archive-emerald bg-archive-emerald/10 shadow-emerald-glow"
                  : "border-archive-emerald/40 bg-slate-900/40 hover:border-archive-emerald hover:bg-slate-900/70"
              }`}
            >
              <ImagePlus
                className={`h-10 w-10 transition-colors ${dragging ? "text-archive-emerald" : "text-archive-emerald/70"}`}
                aria-hidden
              />
              <span className="mt-4 font-serif text-xl text-slate-100">
                {dragging ? copy.dropActive : copy.dropTitle}
              </span>
              <span className="mt-2 text-sm text-slate-400">{copy.dropHint}</span>
            </motion.button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={[...ACCEPTED_IMAGE_TYPES, ".heic", ".heif"].join(",")}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                void handleFiles(e.target.files);
                e.target.value = "";
              }}
            />

            {/* Upload queue */}
            <AnimatePresence initial={false}>
              {queue.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="divide-y divide-slate-800 overflow-hidden rounded-md border border-slate-800 bg-slate-900/50"
                  aria-live="polite"
                >
                  {queue.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 px-4 py-3"
                    >
                      <img
                        src={item.preview}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-slate-200">{item.name}</p>
                        {item.status === "error" && item.error && (
                          <p className="text-xs text-red-400">{copy.errors[item.error]}</p>
                        )}
                      </div>
                      <StatusBadge status={item.status} />
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            {/* Photos already in storage for the selected year */}
            {showGallery && (
            <div>
              <h3 className="mb-4 font-serif text-xl text-slate-100">
                {copy.galleryHeading(yearLabel)}
              </h3>
              {gallery.isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-archive-emerald" aria-hidden />
              ) : gallery.isError ? (
                <p className="text-sm text-red-400">{copy.errors["list-failed"]}</p>
              ) : gallery.data && gallery.data.length > 0 ? (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {gallery.data.map((photo) => (
                    <li
                      key={photo.path}
                      className="photo-grain relative overflow-hidden rounded border border-slate-800 bg-slate-900"
                    >
                      <img
                        src={photo.url}
                        alt={photo.name}
                        loading="lazy"
                        decoding="async"
                        className="aspect-square w-full object-cover"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">{copy.galleryEmpty}</p>
              )}
            </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: QueueStatus }) {
  if (status === "uploading") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin text-archive-emerald" aria-hidden />
        {copy.statusUploading}
      </span>
    );
  }
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-archive-emerald">
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        {copy.statusDone}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-red-400">
      <XCircle className="h-4 w-4" aria-hidden />
      {copy.statusError}
    </span>
  );
}
