/**
 * Date-availability poll for the next lunch — open, name-based voting.
 *
 * Unlike the member-only `date_votes` table (see src/lib/supabase.ts), this poll
 * needs no sign-in: each person types their name and marks the days they can make
 * it, and everyone sees who voted for what. One "vote" = one (name, date) pair.
 *
 * Backend: table `public.almoco_votes` (see supabase/setup.sql). When Supabase is
 * configured the votes are shared across every device and update live; when it is
 * not, the poll still works but keeps answers in this browser only (localStorage).
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface PollVote {
  /** Display name, exactly as the person typed it. */
  voter: string;
  /** ISO date (YYYY-MM-DD) they marked as available. */
  date: string;
}

export const isPollShared = isSupabaseConfigured;

const TABLE = "almoco_votes";

/** Match the same person across spellings: trimmed, accent-free, lower-case, single-spaced. */
export function normalizeName(name: string): string {
  return name
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/* ------------------------------------------------------------------ */
/* Local fallback (single device)                                      */
/* ------------------------------------------------------------------ */

type LocalStore = Record<string, { name: string; dates: string[] }>;

const localKey = (year: number) => `almoco-votes-${year}`;

function localRead(year: number): LocalStore {
  try {
    const raw = window.localStorage.getItem(localKey(year));
    return raw ? (JSON.parse(raw) as LocalStore) : {};
  } catch {
    return {};
  }
}

function localWrite(year: number, store: LocalStore) {
  try {
    window.localStorage.setItem(localKey(year), JSON.stringify(store));
  } catch {
    /* storage blocked — ignore */
  }
}

function localToVotes(store: LocalStore): PollVote[] {
  const votes: PollVote[] = [];
  for (const entry of Object.values(store)) {
    for (const date of entry.dates) votes.push({ voter: entry.name, date });
  }
  return votes;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Every (name, date) vote for a year. Throws on a backend error so react-query can retry. */
export async function getVotes(year: number): Promise<PollVote[]> {
  if (!supabase) return localToVotes(localRead(year));

  const { data, error } = await supabase
    .from(TABLE)
    .select("voter_name, lunch_date")
    .eq("year", year);
  if (error) throw new Error(error.message);

  return (data ?? []).map((r: { voter_name: string; lunch_date: string }) => ({
    voter: r.voter_name,
    date: r.lunch_date,
  }));
}

/**
 * Replace this person's availability with exactly `dates` (an empty list removes them).
 * Matching is by normalized name, so re-submitting the same name edits the earlier vote.
 */
export async function saveVotes(year: number, name: string, dates: string[]): Promise<void> {
  const display = name.trim();
  const key = normalizeName(name);
  if (!key) throw new Error("empty-name");

  if (!supabase) {
    const store = localRead(year);
    if (dates.length === 0) delete store[key];
    else store[key] = { name: display, dates: [...dates] };
    localWrite(year, store);
    return;
  }

  // Replace the whole set for this voter: clear, then insert the current picks.
  const del = await supabase.from(TABLE).delete().eq("year", year).eq("voter_key", key);
  if (del.error) throw new Error(del.error.message);

  if (dates.length === 0) return;

  const rows = dates.map((date) => ({
    year,
    voter_key: key,
    voter_name: display,
    lunch_date: date,
  }));
  const ins = await supabase.from(TABLE).insert(rows);
  if (ins.error) throw new Error(ins.error.message);
}

/** Remove this person's votes entirely. */
export async function removeVotes(year: number, name: string): Promise<void> {
  await saveVotes(year, name, []);
}

/**
 * Call `onChange` whenever any vote changes, for live results.
 * Returns an unsubscribe function. No-op in local (single-device) mode.
 */
export function subscribeToVotes(year: number, onChange: () => void): () => void {
  const client = supabase;
  if (!client) return () => undefined;
  const channel = client
    .channel(`almoco_votes_${year}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE, filter: `year=eq.${year}` },
      () => onChange(),
    )
    .subscribe();
  return () => {
    void client.removeChannel(channel);
  };
}

/* ================================================================== */
/* Main-course choice — one dish per person                            */
/* ================================================================== */

export interface MainChoice {
  /** Display name, exactly as the person typed it. */
  voter: string;
  /** Dish id (see mainCourseOptions in timelineData). */
  dish: string;
}

const MAINS_TABLE = "almoco_mains";

type LocalMains = Record<string, { name: string; dish: string }>;

const mainsKey = (year: number) => `almoco-mains-${year}`;

function mainsRead(year: number): LocalMains {
  try {
    const raw = window.localStorage.getItem(mainsKey(year));
    return raw ? (JSON.parse(raw) as LocalMains) : {};
  } catch {
    return {};
  }
}

function mainsWrite(year: number, store: LocalMains) {
  try {
    window.localStorage.setItem(mainsKey(year), JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

/** Every (name, dish) choice for a year. Throws on a backend error so react-query can retry. */
export async function getMains(year: number): Promise<MainChoice[]> {
  if (!supabase) {
    return Object.values(mainsRead(year)).map((e) => ({ voter: e.name, dish: e.dish }));
  }
  const { data, error } = await supabase
    .from(MAINS_TABLE)
    .select("voter_name, dish")
    .eq("year", year);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: { voter_name: string; dish: string }) => ({
    voter: r.voter_name,
    dish: r.dish,
  }));
}

/** Set this person's main course (one dish). An empty dish removes the choice. */
export async function setMain(year: number, name: string, dish: string): Promise<void> {
  const display = name.trim();
  const key = normalizeName(name);
  if (!key) throw new Error("empty-name");

  if (!supabase) {
    const store = mainsRead(year);
    if (!dish) delete store[key];
    else store[key] = { name: display, dish };
    mainsWrite(year, store);
    return;
  }

  const del = await supabase.from(MAINS_TABLE).delete().eq("year", year).eq("voter_key", key);
  if (del.error) throw new Error(del.error.message);
  if (!dish) return;

  const ins = await supabase
    .from(MAINS_TABLE)
    .insert({ year, voter_key: key, voter_name: display, dish });
  if (ins.error) throw new Error(ins.error.message);
}

/** Remove this person's main-course choice. */
export async function removeMain(year: number, name: string): Promise<void> {
  await setMain(year, name, "");
}

/** Live updates for the main-course board. Returns an unsubscribe; no-op in local mode. */
export function subscribeToMains(year: number, onChange: () => void): () => void {
  const client = supabase;
  if (!client) return () => undefined;
  const channel = client
    .channel(`almoco_mains_${year}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: MAINS_TABLE, filter: `year=eq.${year}` },
      () => onChange(),
    )
    .subscribe();
  return () => {
    void client.removeChannel(channel);
  };
}
