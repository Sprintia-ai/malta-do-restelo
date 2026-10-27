import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { restaurantSuggestions, siteContent } from "@/data/timelineData";

const copy = siteContent.nextLunchPage.restaurants;
const STORAGE_KEY = "restaurante-voto";

/** This viewer's saved choice, if any. Storage can be blocked, so guard it. */
function readVote(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Three restaurant suggestions for the next lunch, each a high-contrast white
 * card with a large "Votar neste Restaurante" button. The viewer's choice is
 * kept in their own browser so it survives a reload.
 */
export default function RestaurantSuggestions() {
  const [voted, setVoted] = useState<string | null>(readVote);

  const vote = (id: string, name: string) => {
    setVoted(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
    toast.success(copy.voteToast(name));
  };

  return (
    <section aria-labelledby="restaurantes-titulo" className="border-t border-slate-800/80 bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-10">
          <h2 id="restaurantes-titulo" className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
            {copy.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">{copy.intro}</p>
        </header>

        <ul className="grid gap-6 lg:grid-cols-3">
          {restaurantSuggestions.map((r) => {
            const isVoted = voted === r.id;
            return (
              <li key={r.id} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-xl border-2 bg-white p-6 shadow-sm sm:p-8 ${
                    isVoted ? "border-[#10B981] ring-2 ring-[#10B981]" : "border-slate-200"
                  }`}
                >
                  {isVoted && (
                    <p className="mb-4 inline-flex items-center gap-2 self-start rounded-full bg-[#10B981] px-4 py-1.5 text-base font-bold text-white">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {copy.voted}
                    </p>
                  )}

                  <h3 className="font-serif text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{r.name}</h3>
                  <p className="mt-1 text-lg text-slate-600">{r.area}</p>

                  <p className="mt-5 text-lg font-bold text-[#047857]">{r.match}</p>

                  <dl className="mt-5 space-y-4 text-lg leading-relaxed text-slate-800">
                    <div>
                      <dt className="font-bold text-slate-900">{copy.whyLabel}</dt>
                      <dd className="mt-1">{r.why}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-900">{copy.priceLabel}</dt>
                      <dd className="mt-1 tracking-widest">{r.price}</dd>
                    </div>
                  </dl>

                  {/* Button pinned to the bottom so all three line up */}
                  <button
                    type="button"
                    onClick={() => vote(r.id, r.name)}
                    aria-pressed={isVoted}
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-5 text-lg font-bold text-white transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#047857] ${
                      isVoted ? "bg-[#047857]" : "bg-[#10B981] hover:bg-[#059669]"
                    }`}
                  >
                    {isVoted ? (
                      <>
                        <Check className="h-5 w-5" aria-hidden="true" />
                        {copy.voted}
                      </>
                    ) : (
                      copy.voteButton
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
