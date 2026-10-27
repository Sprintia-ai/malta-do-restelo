import { useId, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FilterChips from "@/components/archive/FilterChips";
import { siteContent } from "@/data/timelineData";
import { signInWithMagicLink, signInWithPassword, signOut } from "@/lib/supabase";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.auth;

type Mode = "magic" | "password";
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; email: string } | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-100 transition-colors focus:border-archive-emerald focus:outline-none focus:ring-1 focus:ring-archive-emerald";

/** Only allow internal redirects ("/…"), never another site. */
const safeNext = (value: string | null) => (value && value.startsWith("/") && !value.startsWith("//") ? value : "/");

export default function Auth() {
  useDocumentTitle(siteContent.pageTitles.auth);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const { session, configured } = useSupabaseSession();
  const ids = { email: useId(), password: useId() };

  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "sending" });

    if (mode === "magic") {
      const r = await signInWithMagicLink(email, `${window.location.origin}${next}`);
      setStatus(r.ok ? { kind: "sent", email } : { kind: "error", message: r.code === "not-configured" ? siteContent.upload.errors["not-configured"] : copy.linkFailed });
      return;
    }

    const r = await signInWithPassword(email, password);
    if (r.ok) navigate(next, { replace: true });
    else setStatus({ kind: "error", message: r.code === "not-configured" ? siteContent.upload.errors["not-configured"] : copy.invalidCredentials });
  };

  return (
    <section className="flex min-h-[85vh] items-center">
      <div className="mx-auto grid w-full max-w-6xl gap-16 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-slate-50 sm:text-6xl">{copy.heading}</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-400">{copy.intro}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-500">{copy.membersOnly}</p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 sm:p-8">
          {!configured ? (
            <p className="text-slate-400">{siteContent.upload.errors["not-configured"]}</p>
          ) : session ? (
            <div>
              <p className="text-slate-300">{copy.alreadySignedIn(session.user.email ?? "")}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  to={next}
                  className="inline-flex rounded-md bg-archive-emerald px-5 py-2.5 text-sm font-semibold text-archive-night transition-colors hover:bg-archive-emerald-soft"
                >
                  {copy.continue}
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="text-sm text-slate-400 underline underline-offset-4 hover:text-slate-200"
                >
                  {siteContent.upload.signOut}
                </button>
              </div>
            </div>
          ) : status.kind === "sent" ? (
            <p className="text-lg leading-relaxed text-archive-emerald-soft" role="status">
              {copy.linkSent(status.email)}
            </p>
          ) : (
            <>
              <FilterChips<Mode>
                label={copy.heading}
                value={mode}
                onChange={(m) => {
                  setMode(m);
                  setStatus({ kind: "idle" });
                }}
                options={[
                  { value: "magic", label: copy.tabMagic },
                  { value: "password", label: copy.tabPassword },
                ]}
              />

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor={ids.email} className="mb-2 block text-sm font-medium text-slate-300">
                    {copy.emailLabel}
                  </label>
                  <input
                    id={ids.email}
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {mode === "password" && (
                  <div>
                    <label htmlFor={ids.password} className="mb-2 block text-sm font-medium text-slate-300">
                      {copy.passwordLabel}
                    </label>
                    <input
                      id={ids.password}
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                )}

                {status.kind === "error" && (
                  <p className="text-sm text-red-400" role="alert">
                    {status.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status.kind === "sending"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-archive-emerald px-5 py-3 text-sm font-semibold text-archive-night transition-colors hover:bg-archive-emerald-soft disabled:opacity-60"
                >
                  {status.kind === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                  {mode === "magic" ? copy.sendLink : copy.signIn}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
