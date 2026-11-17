import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2, Trash2, Users } from "lucide-react";
import { datePollOptions, formatPollDay, siteContent } from "@/data/timelineData";
import {
  getVotes,
  isPollShared,
  normalizeName,
  removeVotes,
  saveVotes,
  subscribeToVotes,
  type PollVote,
} from "@/lib/poll";

const copy = siteContent.nextLunchPage.availabilityPoll;
const NAME_KEY = "almoco-poll-name";

/** This device's remembered name, so the voter doesn't retype it. Storage can be blocked. */
function readName(): string {
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeName(name: string) {
  try {
    window.localStorage.setItem(NAME_KEY, name);
  } catch {
    /* ignore */
  }
}

interface DateTally {
  date: string;
  voters: string[];
  count: number;
}

export default function AvailabilityPoll({ year }: { year: number }) {
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>(readName);
  // The voter's own edits, tracked only once they start ticking boxes. Until then the
  // checkboxes mirror whatever vote is already saved under their name.
  const [edited, setEdited] = useState<Set<string> | null>(null);

  const votesQuery = useQuery({
    queryKey: ["availability-poll", year],
    queryFn: () => getVotes(year),
  });
  const votes = useMemo<PollVote[]>(() => votesQuery.data ?? [], [votesQuery.data]);

  // Live updates: refetch whenever anyone votes.
  useEffect(() => {
    const unsubscribe = subscribeToVotes(year, () =>
      queryClient.invalidateQueries({ queryKey: ["availability-poll", year] }),
    );
    return unsubscribe;
  }, [year, queryClient]);

  // What this person has already voted for (matched by normalized name).
  const myExistingDates = useMemo(() => {
    const key = normalizeName(name);
    if (!key) return null;
    const mine = votes.filter((v) => normalizeName(v.voter) === key).map((v) => v.date);
    return mine.length > 0 ? mine : null;
  }, [name, votes]);

  // The boxes show the voter's own edits once they start, else their saved vote.
  const picks = edited ?? new Set(myExistingDates ?? []);

  // Tally per date, sorted by the fixed date order.
  const tallies = useMemo<DateTally[]>(() => {
    const byDate = new Map<string, string[]>(datePollOptions.map((d) => [d, []]));
    for (const v of votes) {
      const list = byDate.get(v.date);
      if (list) list.push(v.voter);
    }
    return datePollOptions.map((date) => {
      const voters = (byDate.get(date) ?? []).slice().sort((a, b) => a.localeCompare(b, "pt"));
      return { date, voters, count: voters.length };
    });
  }, [votes]);

  const maxCount = Math.max(0, ...tallies.map((t) => t.count));

  const save = useMutation({
    mutationFn: () => saveVotes(year, name, [...picks]),
    onSuccess: () => {
      writeName(name.trim());
      setEdited(null); // fall back to showing the freshly-saved vote
      queryClient.invalidateQueries({ queryKey: ["availability-poll", year] });
      toast.success(myExistingDates ? copy.updated(name.trim()) : copy.saved(name.trim()));
    },
    onError: () => toast.error(copy.error),
  });

  const remove = useMutation({
    mutationFn: () => removeVotes(year, name),
    onSuccess: () => {
      setEdited(null);
      queryClient.invalidateQueries({ queryKey: ["availability-poll", year] });
      toast.success(copy.removed);
    },
    onError: () => toast.error(copy.error),
  });

  const busy = save.isPending || remove.isPending;
  const nameValid = name.trim().length > 0;

  const toggle = (date: string) => {
    const next = new Set(picks);
    if (next.has(date)) next.delete(date);
    else next.add(date);
    setEdited(next);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameValid) {
      toast.error(copy.nameRequired);
      return;
    }
    save.mutate();
  };

  return (
    <section
      aria-labelledby="poll-titulo"
      className="border-t border-slate-800/80 bg-slate-950 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-8">
          <h2 id="poll-titulo" className="font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">
            {copy.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{copy.intro}</p>
        </header>

        {/* -------------------------------------------------- voting form */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-7"
        >
          <label htmlFor="poll-name" className="block text-sm font-medium text-slate-300">
            {copy.nameLabel}
          </label>
          <input
            id="poll-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setEdited(null);
            }}
            placeholder={copy.namePlaceholder}
            autoComplete="name"
            className="mt-2 w-full rounded-xl border-2 border-slate-700 bg-slate-950 px-4 py-3 text-lg text-slate-50 placeholder:text-slate-600 focus:border-archive-emerald focus:outline-none"
          />
          {myExistingDates && (
            <p className="mt-3 text-sm text-archive-emerald">{copy.editingNote(name.trim())}</p>
          )}

          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-slate-300">{copy.pickLabel}</legend>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {datePollOptions.map((date) => {
                const chosen = picks.has(date);
                return (
                  <li key={date}>
                    <button
                      type="button"
                      onClick={() => toggle(date)}
                      aria-pressed={chosen}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-colors ${
                        chosen
                          ? "border-archive-emerald bg-archive-emerald/15"
                          : "border-slate-700 bg-slate-950/50 hover:border-slate-500"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                          chosen
                            ? "border-archive-emerald bg-archive-emerald text-archive-night"
                            : "border-slate-600"
                        }`}
                      >
                        {chosen && <Check className="h-4 w-4" />}
                      </span>
                      <span className="font-serif text-lg text-slate-50 first-letter:uppercase">
                        {formatPollDay(date)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={busy || !nameValid}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-archive-emerald px-6 py-3.5 text-base font-semibold text-archive-night transition-colors hover:bg-archive-emerald-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {save.isPending && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
              {save.isPending ? copy.saving : myExistingDates ? copy.update : copy.submit}
            </button>
            {myExistingDates && (
              <button
                type="button"
                onClick={() => remove.mutate()}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-700 px-5 py-3 text-base font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-50 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                {copy.remove}
              </button>
            )}
          </div>

          <p className="mt-4 text-sm text-slate-500">{isPollShared ? copy.liveNote : copy.deviceNote}</p>
        </form>

        {/* -------------------------------------------------- live results */}
        <div className="mt-12">
          <h3 className="flex items-center gap-2 font-serif text-2xl font-semibold text-slate-50">
            <Users className="h-5 w-5 text-archive-emerald" aria-hidden />
            {copy.resultsHeading}
          </h3>

          {maxCount === 0 ? (
            <p className="mt-6 text-slate-500">{copy.empty}</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {tallies.map(({ date, voters, count }) => {
                const leading = count > 0 && count === maxCount;
                const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
                return (
                  <li
                    key={date}
                    className={`rounded-xl border px-5 py-4 ${
                      leading ? "border-archive-emerald/60 bg-archive-emerald/10" : "border-slate-800 bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-serif text-lg text-slate-50 first-letter:uppercase">
                        {formatPollDay(date)}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        {leading && (
                          <span className="rounded-full bg-archive-emerald px-2.5 py-0.5 text-xs font-bold text-archive-night">
                            {copy.leading}
                          </span>
                        )}
                        <span className="text-sm tabular-nums text-slate-400">{copy.votes(count)}</span>
                      </span>
                    </div>

                    {/* progress bar */}
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800" aria-hidden>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          leading ? "bg-archive-emerald" : "bg-archive-emerald/50"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {count > 0 ? (
                        <>
                          <span className="font-medium text-slate-300">{copy.voters}:</span>{" "}
                          {voters.join(", ")}
                        </>
                      ) : (
                        copy.noVotesYet
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
