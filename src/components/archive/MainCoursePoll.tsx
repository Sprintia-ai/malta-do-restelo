import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2, Trash2, UtensilsCrossed } from "lucide-react";
import { mainCourseOptions, siteContent } from "@/data/timelineData";
import {
  getMains,
  isPollShared,
  normalizeName,
  removeMain,
  setMain,
  subscribeToMains,
  type MainChoice,
} from "@/lib/poll";

const copy = siteContent.nextLunchPage.mainPoll;
// Shared with the date poll, so entering a name on one carries to the other.
const NAME_KEY = "almoco-poll-name";

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

const dishName = (id: string) => mainCourseOptions.find((d) => d.id === id)?.name ?? id;

export default function MainCoursePoll({ year }: { year: number }) {
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>(readName);
  // The voter's own pick once they touch the list; before that, their saved choice shows.
  const [edited, setEdited] = useState<string | null>(null);

  const choicesQuery = useQuery({
    queryKey: ["main-poll", year],
    queryFn: () => getMains(year),
  });
  const choices = useMemo<MainChoice[]>(() => choicesQuery.data ?? [], [choicesQuery.data]);

  useEffect(() => {
    const unsubscribe = subscribeToMains(year, () =>
      queryClient.invalidateQueries({ queryKey: ["main-poll", year] }),
    );
    return unsubscribe;
  }, [year, queryClient]);

  // This person's saved dish (matched by normalized name).
  const myDish = useMemo(() => {
    const key = normalizeName(name);
    if (!key) return null;
    return choices.find((c) => normalizeName(c.voter) === key)?.dish ?? null;
  }, [name, choices]);

  const selected = edited ?? myDish ?? "";

  // Tally per dish, in menu order.
  const tally = useMemo(() => {
    const byDish = new Map<string, string[]>(mainCourseOptions.map((d) => [d.id, []]));
    for (const c of choices) {
      const list = byDish.get(c.dish);
      if (list) list.push(c.voter);
    }
    return mainCourseOptions.map((d) => {
      const voters = (byDish.get(d.id) ?? []).slice().sort((a, b) => a.localeCompare(b, "pt"));
      return { dish: d, voters, count: voters.length };
    });
  }, [choices]);

  const maxCount = Math.max(0, ...tally.map((t) => t.count));
  const totalChoices = choices.length;

  const save = useMutation({
    mutationFn: () => setMain(year, name, selected),
    onSuccess: () => {
      writeName(name.trim());
      setEdited(null);
      queryClient.invalidateQueries({ queryKey: ["main-poll", year] });
      toast.success(copy.saved(name.trim()));
    },
    onError: () => toast.error(copy.error),
  });

  const remove = useMutation({
    mutationFn: () => removeMain(year, name),
    onSuccess: () => {
      setEdited(null);
      queryClient.invalidateQueries({ queryKey: ["main-poll", year] });
      toast.success(copy.removed);
    },
    onError: () => toast.error(copy.error),
  });

  const busy = save.isPending || remove.isPending;
  const nameValid = name.trim().length > 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameValid) {
      toast.error(copy.nameRequired);
      return;
    }
    if (!selected) return;
    save.mutate();
  };

  return (
    <section
      aria-labelledby="prato-titulo"
      className="border-t border-slate-800/80 bg-slate-950 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-8">
          <h2
            id="prato-titulo"
            className="flex items-center gap-3 font-serif text-3xl font-semibold text-slate-50 sm:text-4xl"
          >
            <UtensilsCrossed className="h-7 w-7 shrink-0 text-archive-emerald" aria-hidden />
            {copy.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{copy.intro}</p>
        </header>

        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-7">
          <label htmlFor="main-name" className="block text-sm font-medium text-slate-300">
            {copy.nameLabel}
          </label>
          <input
            id="main-name"
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
          {myDish && (
            <p className="mt-3 text-sm text-archive-emerald">{copy.editingNote(name.trim(), dishName(myDish))}</p>
          )}

          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-slate-300">{copy.pickLabel}</legend>
            <ul className="mt-3 space-y-2.5">
              {mainCourseOptions.map((dish) => {
                const chosen = selected === dish.id;
                return (
                  <li key={dish.id}>
                    <button
                      type="button"
                      onClick={() => setEdited(dish.id)}
                      aria-pressed={chosen}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-colors ${
                        chosen
                          ? "border-archive-emerald bg-archive-emerald/15"
                          : "border-slate-700 bg-slate-950/50 hover:border-slate-500"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          chosen ? "border-archive-emerald bg-archive-emerald text-archive-night" : "border-slate-600"
                        }`}
                      >
                        {chosen && <Check className="h-4 w-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-serif text-lg text-slate-50">{dish.name}</span>
                        {dish.note && <span className="block text-sm text-slate-500">{dish.note}</span>}
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
              disabled={busy || !nameValid || !selected}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-archive-emerald px-6 py-3.5 text-base font-semibold text-archive-night transition-colors hover:bg-archive-emerald-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {save.isPending && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
              {save.isPending ? copy.saving : myDish ? copy.update : copy.submit}
            </button>
            {myDish && (
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

        {/* ------------------------------------------------ results */}
        <div className="mt-12">
          <h3 className="font-serif text-2xl font-semibold text-slate-50">{copy.resultsHeading}</h3>
          {totalChoices === 0 ? (
            <p className="mt-6 text-slate-500">{copy.empty}</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {tally.map(({ dish, voters, count }) => {
                const leading = count > 0 && count === maxCount;
                const pct = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
                return (
                  <li
                    key={dish.id}
                    className={`rounded-xl border px-5 py-4 ${
                      leading ? "border-archive-emerald/60 bg-archive-emerald/10" : "border-slate-800 bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-serif text-lg text-slate-50">{dish.name}</span>
                      <span className="shrink-0 text-sm tabular-nums text-slate-400">{copy.people(count)}</span>
                    </div>
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
                          <span className="font-medium text-slate-300">{copy.chosenBy}:</span> {voters.join(", ")}
                        </>
                      ) : (
                        copy.noneYet
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
