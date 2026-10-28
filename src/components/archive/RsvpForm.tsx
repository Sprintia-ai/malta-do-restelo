import { useEffect, useId, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Minus, Plus } from "lucide-react";
import { siteContent } from "@/data/timelineData";
import { deleteMyRsvp, getMyRsvp, getRsvpHeadcount, saveRsvp } from "@/lib/supabase";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

const copy = siteContent.rsvp;
const errors = siteContent.upload.errors;

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 placeholder:text-slate-600 transition-colors focus:border-archive-emerald focus:outline-none focus:ring-1 focus:ring-archive-emerald";

export default function RsvpForm({ year }: { year: number }) {
  const { session, loading, configured } = useSupabaseSession();
  const queryClient = useQueryClient();
  const ids = { name: useId(), note: useId() };

  const [name, setName] = useState("");
  const [guests, setGuests] = useState(0);
  const [note, setNote] = useState("");

  const mine = useQuery({
    queryKey: ["rsvp", "mine", year],
    queryFn: async () => {
      const r = await getMyRsvp(year);
      if (!r.ok) throw new Error(r.code);
      return r.data;
    },
    enabled: Boolean(session),
  });

  const headcount = useQuery({
    queryKey: ["rsvp", "count", year],
    queryFn: async () => {
      const r = await getRsvpHeadcount(year);
      if (!r.ok) throw new Error(r.code);
      return r.data;
    },
    enabled: Boolean(session),
  });

  // Pre-fill from an existing RSVP, or from the account's display name
  useEffect(() => {
    if (mine.data) {
      setName(mine.data.name);
      setGuests(mine.data.guests);
      setNote(mine.data.note ?? "");
    } else if (session && !name) {
      const meta = session.user.user_metadata as { full_name?: string; name?: string } | undefined;
      setName(meta?.full_name ?? meta?.name ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mine.data, session]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["rsvp"] });

  const save = useMutation({
    mutationFn: async () => {
      const r = await saveRsvp({ year, name, guests, note });
      if (!r.ok) throw new Error(r.code);
      return r.data;
    },
    onSuccess: () => {
      toast.success(copy.confirmed);
      refresh();
    },
    onError: () => toast.error(errors["rsvp-failed"]),
  });

  const cancel = useMutation({
    mutationFn: async () => {
      const r = await deleteMyRsvp(year);
      if (!r.ok) throw new Error(r.code);
    },
    onSuccess: () => {
      toast(copy.cancelled);
      setGuests(0);
      setNote("");
      refresh();
    },
    onError: () => toast.error(errors["rsvp-failed"]),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) save.mutate();
  };

  return (
    <section aria-labelledby="rsvp-heading" className="rounded-lg border border-slate-800 bg-slate-950 p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="rsvp-heading" className="font-serif text-2xl font-semibold text-slate-50 sm:text-3xl">
          {copy.heading}
        </h2>
        {typeof headcount.data === "number" && headcount.data > 0 && (
          <p className="text-sm text-archive-emerald">{copy.total(headcount.data)}</p>
        )}
      </div>
      <p className="mt-3 text-slate-400">{copy.intro}</p>

      {!configured ? (
        <p className="mt-6 text-sm text-slate-500">{errors["not-configured"]}</p>
      ) : loading ? (
        <Loader2 className="mt-6 h-5 w-5 animate-spin text-archive-emerald" aria-hidden />
      ) : !session ? (
        <div className="mt-6">
          <p className="text-slate-300">{copy.signInPrompt}</p>
          <Link
            to="/auth?next=/proximo-almoco"
            className="mt-4 inline-flex rounded-md bg-archive-emerald px-5 py-2.5 text-sm font-semibold text-archive-night transition-colors hover:bg-archive-emerald-soft"
          >
            {siteContent.upload.signInCta}
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {mine.data && (
            <p className="rounded-md border border-archive-emerald/40 bg-archive-emerald/10 px-4 py-3 text-sm text-archive-emerald-soft">
              {copy.yourRsvp(mine.data.guests)}
            </p>
          )}

          <div>
            <label htmlFor={ids.name} className="mb-2 block text-sm font-medium text-slate-300">
              {copy.nameLabel}
            </label>
            <input
              id={ids.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-slate-300">{copy.guestsLabel}</legend>
            <div className="inline-flex items-center rounded-md border border-slate-700">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(0, g - 1))}
                disabled={guests === 0}
                aria-label={`${copy.guestsLabel} −1`}
                className="p-3 text-slate-300 transition-colors hover:text-archive-emerald disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>
              <output aria-live="polite" className="w-12 text-center font-serif text-xl tabular-nums text-slate-50">
                {guests}
              </output>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(10, g + 1))}
                disabled={guests === 10}
                aria-label={`${copy.guestsLabel} +1`}
                className="p-3 text-slate-300 transition-colors hover:text-archive-emerald disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </fieldset>

          <div>
            <label htmlFor={ids.note} className="mb-2 block text-sm font-medium text-slate-300">
              {copy.noteLabel}
            </label>
            <textarea
              id={ids.note}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={500}
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={save.isPending || !name.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-archive-emerald px-6 py-3 text-sm font-semibold text-archive-night transition-colors hover:bg-archive-emerald-soft disabled:opacity-50"
            >
              {save.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {mine.data ? copy.update : copy.submit}
            </button>
            {mine.data && (
              <button
                type="button"
                onClick={() => cancel.mutate()}
                disabled={cancel.isPending}
                className="text-sm text-slate-400 underline underline-offset-4 transition-colors hover:text-amber-400"
              >
                {copy.cancel}
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
