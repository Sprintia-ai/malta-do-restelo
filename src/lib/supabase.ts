/**
 * All Supabase access for the archive lives here: client setup, authentication,
 * photo storage and RSVPs. Components and hooks import these functions — they
 * never call `supabase.*` directly. Database/bucket setup: supabase/setup.sql.
 *
 * Required env vars (.env.local):
 *   VITE_SUPABASE_URL=https://<project>.supabase.co
 *   VITE_SUPABASE_ANON_KEY=<anon / publishable key>
 * Optional:
 *   VITE_SUPABASE_PHOTO_BUCKET=archive-photos
 *
 * If the env vars are missing the site still renders (static timeline); auth and
 * uploads report a "not-configured" error instead of crashing.
 */

import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";
import type { UploadErrorCode } from "@/data/timelineData";

/* ------------------------------------------------------------------ */
/* Client                                                              */
/* ------------------------------------------------------------------ */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined;

export const PHOTO_BUCKET =
  (import.meta.env.VITE_SUPABASE_PHOTO_BUCKET as string | undefined) ?? "archive-photos";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/* ------------------------------------------------------------------ */
/* Result type                                                         */
/* ------------------------------------------------------------------ */

export type ArchiveResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: UploadErrorCode; message?: string };

const fail = <T>(code: UploadErrorCode, message?: string): ArchiveResult<T> => ({
  ok: false,
  code,
  message,
});

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Subscribe to auth changes. Returns an unsubscribe function. */
export function onAuthChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): () => void {
  if (!supabase) return () => undefined;
  const { data } = supabase.auth.onAuthStateChange(callback);
  return () => data.subscription.unsubscribe();
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<ArchiveResult<Session>> {
  if (!supabase) return fail("not-configured");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) return fail("not-authenticated", error?.message);
  return { ok: true, data: data.session };
}

/** Passwordless sign-in: sends a magic link to the e-mail address. */
export async function signInWithMagicLink(
  email: string,
  redirectTo: string = window.location.origin,
): Promise<ArchiveResult<null>> {
  if (!supabase) return fail("not-configured");
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
  });
  if (error) return fail("not-authenticated", error.message);
  return { ok: true, data: null };
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/* ------------------------------------------------------------------ */
/* Storage — photos are stored as <bucket>/<year|sem-ano>/<timestamp>-<name> */
/* ------------------------------------------------------------------ */

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

const UNKNOWN_YEAR_FOLDER = "sem-ano";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export interface ArchivePhoto {
  path: string;
  name: string;
  url: string;
  createdAt: string | null;
  sizeBytes: number | null;
}

export function validateImageFile(file: File): ArchiveResult<File> {
  const type = file.type.toLowerCase();
  const isHeicByName = /\.(heic|heif)$/i.test(file.name);
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(type) && !isHeicByName) {
    return fail("invalid-type");
  }
  if (file.size > MAX_PHOTO_BYTES) return fail("too-large");
  return { ok: true, data: file };
}

const yearFolder = (year: number | null): string =>
  year === null ? UNKNOWN_YEAR_FOLDER : String(year);

/** Lower-case, accent-free, URL-safe file name that keeps the extension. */
function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "jpg";
  const slug = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${slug || "fotografia"}.${ext}`;
}

export function buildPhotoPath(year: number | null, file: File): string {
  return `${yearFolder(year)}/${Date.now()}-${safeFileName(file.name)}`;
}

export async function uploadPhoto(
  file: File,
  year: number | null,
): Promise<ArchiveResult<ArchivePhoto>> {
  if (!supabase) return fail("not-configured");

  const session = await getSession();
  if (!session) return fail("not-authenticated");

  const valid = validateImageFile(file);
  if (!valid.ok) return valid;

  const path = buildPhotoPath(year, file);
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) return fail("upload-failed", error.message);

  const url = await getPhotoUrl(path);
  return {
    ok: true,
    data: {
      path,
      name: file.name,
      url: url ?? "",
      createdAt: new Date().toISOString(),
      sizeBytes: file.size,
    },
  };
}

/** Signed URL — works for both private and public buckets. */
export async function getPhotoUrl(path: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (error) return null;
  return data.signedUrl;
}

export async function listPhotosForYear(
  year: number | null,
): Promise<ArchiveResult<ArchivePhoto[]>> {
  if (!supabase) return fail("not-configured");

  const folder = yearFolder(year);
  const { data: files, error } = await supabase.storage.from(PHOTO_BUCKET).list(folder, {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) return fail("list-failed", error.message);

  // Supabase returns a ".emptyFolderPlaceholder" entry and sub-folders (id === null); skip both.
  const photos = (files ?? []).filter((f) => f.id !== null && !f.name.startsWith("."));
  if (photos.length === 0) return { ok: true, data: [] };

  const paths = photos.map((f) => `${folder}/${f.name}`);
  const { data: signed, error: signError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
  if (signError) return fail("list-failed", signError.message);

  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return {
    ok: true,
    data: photos.map((f, i) => ({
      path: paths[i],
      name: f.name,
      url: urlByPath.get(paths[i]) ?? "",
      createdAt: f.created_at ?? null,
      sizeBytes: typeof f.metadata?.size === "number" ? f.metadata.size : null,
    })),
  };
}

export async function deletePhoto(path: string): Promise<ArchiveResult<null>> {
  if (!supabase) return fail("not-configured");
  const { error } = await supabase.storage.from(PHOTO_BUCKET).remove([path]);
  if (error) return fail("upload-failed", error.message);
  return { ok: true, data: null };
}

/** Every member-uploaded photo across all year folders, newest year first. */
export async function listAllPhotos(): Promise<
  ArchiveResult<Array<ArchivePhoto & { year: number | null }>>
> {
  if (!supabase) return fail("not-configured");

  const { data: folders, error } = await supabase.storage.from(PHOTO_BUCKET).list("", {
    limit: 200,
    sortBy: { column: "name", order: "desc" },
  });
  if (error) return fail("list-failed", error.message);

  // Folders come back with id === null
  const yearFolders = (folders ?? [])
    .filter((f) => f.id === null)
    .map((f) => f.name)
    .filter((name) => name === UNKNOWN_YEAR_FOLDER || /^\d{4}$/.test(name));

  const results = await Promise.all(
    yearFolders.map(async (name) => {
      const year = name === UNKNOWN_YEAR_FOLDER ? null : Number(name);
      const res = await listPhotosForYear(year);
      return res.ok ? res.data.map((p) => ({ ...p, year })) : [];
    }),
  );

  return { ok: true, data: results.flat() };
}

/* ------------------------------------------------------------------ */
/* RSVP — table `rsvps`, one row per member per lunch year             */
/* (see supabase/setup.sql)                                            */
/* ------------------------------------------------------------------ */

export interface Rsvp {
  id: string;
  user_id: string;
  year: number;
  name: string;
  guests: number;
  note: string | null;
  created_at: string;
}

export interface RsvpInput {
  year: number;
  name: string;
  guests: number;
  note?: string;
}

export async function getMyRsvp(year: number): Promise<ArchiveResult<Rsvp | null>> {
  if (!supabase) return fail("not-configured");
  const session = await getSession();
  if (!session) return fail("not-authenticated");

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("year", year)
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (error) return fail("rsvp-failed", error.message);
  return { ok: true, data: (data as Rsvp | null) ?? null };
}

/** Total people coming (members + their guests) for a year. */
export async function getRsvpHeadcount(year: number): Promise<ArchiveResult<number>> {
  if (!supabase) return fail("not-configured");
  const { data, error } = await supabase.from("rsvps").select("guests").eq("year", year);
  if (error) return fail("rsvp-failed", error.message);
  const rows = (data ?? []) as Array<{ guests: number }>;
  return { ok: true, data: rows.reduce((sum, r) => sum + 1 + (r.guests ?? 0), 0) };
}

export async function saveRsvp(input: RsvpInput): Promise<ArchiveResult<Rsvp>> {
  if (!supabase) return fail("not-configured");
  const session = await getSession();
  if (!session) return fail("not-authenticated");

  const { data, error } = await supabase
    .from("rsvps")
    .upsert(
      {
        user_id: session.user.id,
        year: input.year,
        name: input.name.trim(),
        guests: Math.max(0, Math.min(10, Math.round(input.guests))),
        note: input.note?.trim() || null,
      },
      { onConflict: "user_id,year" },
    )
    .select()
    .single();
  if (error) return fail("rsvp-failed", error.message);
  return { ok: true, data: data as Rsvp };
}

export async function deleteMyRsvp(year: number): Promise<ArchiveResult<null>> {
  if (!supabase) return fail("not-configured");
  const session = await getSession();
  if (!session) return fail("not-authenticated");

  const { error } = await supabase
    .from("rsvps")
    .delete()
    .eq("year", year)
    .eq("user_id", session.user.id);
  if (error) return fail("rsvp-failed", error.message);
  return { ok: true, data: null };
}

/* ------------------------------------------------------------------ */
/* Date poll — table `date_votes`, one row per member per candidate date */
/* (see supabase/setup.sql)                                            */
/* ------------------------------------------------------------------ */

/** Candidate dates (ISO) this member has marked as available for a year. */
export async function getMyDateVotes(year: number): Promise<ArchiveResult<string[]>> {
  if (!supabase) return fail("not-configured");
  const session = await getSession();
  if (!session) return fail("not-authenticated");
  const { data, error } = await supabase
    .from("date_votes")
    .select("date")
    .eq("year", year)
    .eq("user_id", session.user.id);
  if (error) return fail("rsvp-failed", error.message);
  return { ok: true, data: (data ?? []).map((r: { date: string }) => r.date) };
}

/** Vote count per candidate date for a year. */
export async function getDateTally(year: number): Promise<ArchiveResult<Record<string, number>>> {
  if (!supabase) return fail("not-configured");
  const { data, error } = await supabase.from("date_votes").select("date").eq("year", year);
  if (error) return fail("rsvp-failed", error.message);
  const tally: Record<string, number> = {};
  for (const r of (data ?? []) as Array<{ date: string }>) tally[r.date] = (tally[r.date] ?? 0) + 1;
  return { ok: true, data: tally };
}

/** Add or remove this member's availability for one candidate date. */
export async function setMyDateVote(
  year: number,
  date: string,
  available: boolean,
): Promise<ArchiveResult<null>> {
  if (!supabase) return fail("not-configured");
  const session = await getSession();
  if (!session) return fail("not-authenticated");

  if (available) {
    const { error } = await supabase
      .from("date_votes")
      .upsert({ user_id: session.user.id, year, date }, { onConflict: "user_id,year,date" });
    if (error) return fail("rsvp-failed", error.message);
  } else {
    const { error } = await supabase
      .from("date_votes")
      .delete()
      .eq("user_id", session.user.id)
      .eq("year", year)
      .eq("date", date);
    if (error) return fail("rsvp-failed", error.message);
  }
  return { ok: true, data: null };
}
