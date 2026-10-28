import { Link } from "react-router-dom";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { datePollOptions, formatPollDay, siteContent } from "@/data/timelineData";
import { getDateTally, getMyDateVotes, setMyDateVote } from "@/lib/supabase";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

const copy = siteContent.nextLunchPage.datePoll;

/**
 * Shared date poll for the next lunch. Each member marks the Fridays and
 * Saturdays they can attend; the date with the most votes is highlighted as
 * the front-runner. Needs Supabase (like the RSVP); until it is connected the
 * section explains that voting isn't available yet.
 */
export default function DatePoll({ year }: { year: number }) {
  const { session, loading, configured } = useSupabaseSession();
  const queryClient = useQueryClient();

  const [tallyQuery, mineQuery] = useQueries({
    queries: [
      {
        queryKey: ["date-poll", "tally", year],
        queryFn: async () => {
          const r = await getDateTally(year);
          if (!r.ok) throw new Error(r.code);
          return r.data;
        },
        enabled: Boolean(session),
      },
      {
        queryKey: ["date-poll", "mine", year],
        queryFn: async () => {
          const r = await getMyDateVotes(year);
          if (!r.ok) throw new Error(r.code);
          return r.data;
        },
        enabled: Boolean(session),
      },
    ],
  });

  const tally = tallyQuery.data ?? {};
  const mine = new Set(mineQuery.data ?? []);
  const maxVotes = Math.max(0, ...datePollOptions.map((d) => tally[d] ?? 0));

  const toggle = useMutation({
    mutationFn: async (date: string) => {
      const r = await setMyDateVote(year, date, !mine.has(date));
      if (!r.ok) throw new Error(r.code);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["date-poll"] }),
    onError: () => toast.error(copy.error),
  });

  return (
    <section aria-labelledby="date-poll-titulo" className="border-t border-slate-800/80 bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-8">
          <h2 id="date-poll-titulo" className="font-serif text-3xl font-semibold text-slate-50 sm:text-4xl">
            {copy.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{copy.intro}</p>
        </header>

        {!configured ? (
          <p className="rounded-md border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
            {siteContent.upload.errors["not-configured"]}
          </p>
        ) : loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-archive-emerald" aria-hidden="true" />
        ) : !session ? (
          <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
            <p className="text-lg text-slate-300">{copy.signInPrompt}</p>
            <Link
              to="/auth?next=/proximo-almoco"
              className="mt-5 inline-flex rounded-md bg-archive-emerald px-6 py-3 text-base font-semibold text-archive-night transition-colors hover:bg-archive-emerald-soft"
            >
              {siteContent.upload.signInCta}
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {datePollOptions.map((date) => {
              const votes = tally[date] ?? 0;
              const chosen = mine.has(date);
              const leading = maxVotes > 0 && votes === maxVotes;
              const pending = toggle.isPending && toggle.variables === date;
              return (
                <li key={date}>
                  <button
                    type="button"
                    onClick={() => toggle.mutate(date)}
                    disabled={toggle.isPending}
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
                      ) : (
                        <span className={`text-lg tabular-nums ${leading ? "text-archive-emerald" : "text-slate-400"}`}>
                          {copy.votes(votes)}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {session && maxVotes === 0 && !tallyQuery.isLoading && (
          <p className="mt-6 text-slate-500">{copy.empty}</p>
        )}
      </div>
    </section>
  );
}
