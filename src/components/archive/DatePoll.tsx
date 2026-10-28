import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { datePollOptions, formatPollDay, siteContent } from "@/data/timelineData";
import { getDateTally, getMyDateVotes, setMyDateVote } from "@/lib/supabase";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

const copy = siteContent.nextLunchPage.datePoll;
const STORAGE_KEY = "date-poll-picks";

/** This viewer's saved picks (used until Supabase is connected). Storage can be blocked, so guard it. */
function readLocalPicks(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeLocalPicks(picks: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...picks]));
  } catch {
    /* ignore */
  }
}

/**
 * Date poll for the next lunch: the Fridays and Saturdays up to 23 December.
 * The dates are always shown and selectable. Each member marks every date they
 * can attend. When Supabase is connected and the member is signed in, the votes
 * are tallied across everyone and the front-runner is flagged "Mais votada";
 * before that, choices are kept on the member's own device.
 */
export default function DatePoll({ year }: { year: number }) {
  const { session, configured } = useSupabaseSession();
  const queryClient = useQueryClient();
  const useShared = configured && Boolean(session);

  const [localPicks, setLocalPicks] = useState<Set<string>>(readLocalPicks);

  const [tallyQuery, mineQuery] = useQueries({
    queries: [
      {
        queryKey: ["date-poll", "tally", year],
        queryFn: async () => {
          const r = await getDateTally(year);
          if (!r.ok) throw new Error(r.code);
          return r.data;
        },
        enabled: useShared,
      },
      {
        queryKey: ["date-poll", "mine", year],
        queryFn: async () => {
          const r = await getMyDateVotes(year);
          if (!r.ok) throw new Error(r.code);
          return r.data;
        },
        enabled: useShared,
      },
    ],
  });

  const tally = tallyQuery.data ?? {};
  const mine = useShared ? new Set(mineQuery.data ?? []) : localPicks;
  const maxVotes = Math.max(0, ...datePollOptions.map((d) => tally[d] ?? 0));

  const sharedToggle = useMutation({
    mutationFn: async (date: string) => {
      const r = await setMyDateVote(year, date, !mine.has(date));
      if (!r.ok) throw new Error(r.code);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["date-poll"] }),
    onError: () => toast.error(copy.error),
  });

  const toggle = (date: string) => {
    if (useShared) {
      sharedToggle.mutate(date);
      return;
    }
    setLocalPicks((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      writeLocalPicks(next);
      return next;
    });
  };

  return (
    <section aria-labelledby="date-poll-titulo" className="border-t border-slate-800/80 bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-8">
          <h2 id="date-poll-titulo" className="font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">
            {copy.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{copy.intro}</p>
        </header>

        <ul className="space-y-3">
          {datePollOptions.map((date) => {
            const votes = tally[date] ?? 0;
            const chosen = mine.has(date);
            const leading = useShared && maxVotes > 0 && votes === maxVotes;
            const pending = useShared && sharedToggle.isPending && sharedToggle.variables === date;
            return (
              <li key={date}>
                <button
                  type="button"
                  onClick={() => toggle(date)}
                  disabled={useShared && sharedToggle.isPending}
                  aria-pressed={chosen}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl border-2 px-5 py-5 text-left transition-colors disabled:opacity-70 ${
                    chosen
                      ? "border-archive-emerald bg-archive-emerald/15"
                      : "border-slate-700 bg-slate-900/50 hover:border-slate-500"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 ${
                        chosen ? "border-archive-emerald bg-archive-emerald text-archive-night" : "border-slate-600"
                      }`}
                    >
                      {chosen && <Check className="h-5 w-5" />}
                    </span>
                    <span className="font-serif text-xl text-slate-50 first-letter:uppercase sm:text-2xl">
                      {formatPollDay(date)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    {leading && (
                      <span className="hidden rounded-full bg-archive-emerald px-3 py-1 text-sm font-bold text-archive-night sm:inline">
                        {copy.leading}
                      </span>
                    )}
                    {pending ? (
                      <Loader2 className="h-5 w-5 animate-spin text-archive-emerald" aria-hidden="true" />
                    ) : useShared ? (
                      <span className={`text-lg tabular-nums ${leading ? "text-archive-emerald" : "text-slate-400"}`}>
                        {copy.votes(votes)}
                      </span>
                    ) : (
                      chosen && <span className="text-lg text-archive-emerald">{copy.selected}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* How the votes are being recorded */}
        {useShared ? (
          maxVotes === 0 &&
          !tallyQuery.isLoading && <p className="mt-6 text-slate-500">{copy.empty}</p>
        ) : configured ? (
          <p className="mt-6 text-slate-500">
            {copy.signInToCount}{" "}
            <Link
              to="/auth?next=/proximo-almoco"
              className="text-archive-emerald underline underline-offset-4 hover:text-archive-emerald-soft"
            >
              {siteContent.upload.signInCta}
            </Link>
          </p>
        ) : (
          <p className="mt-6 text-slate-500">{copy.deviceNote}</p>
        )}
      </div>
    </section>
  );
}
