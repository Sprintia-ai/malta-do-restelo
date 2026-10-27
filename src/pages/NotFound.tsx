import { Link } from "react-router-dom";
import { siteContent } from "@/data/timelineData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const copy = siteContent.notFound;

export default function NotFound({ message }: { message?: string }) {
  useDocumentTitle(siteContent.pageTitles.notFound);

  return (
    <section className="flex min-h-[80vh] items-center">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-32 sm:px-6">
        {/* An empty place setting: plate and cutlery, drawn in emerald hairline */}
        <svg viewBox="0 0 200 80" className="mb-12 h-16 w-40 text-archive-emerald" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="100" cy="40" r="30" />
          <circle cx="100" cy="40" r="20" opacity="0.5" />
          <path d="M52 14v52M46 14v14a6 6 0 0 0 12 0V14" />
          <path d="M148 14c6 4 6 20 0 24v28" />
        </svg>
        <h1 className="max-w-2xl font-serif text-5xl font-semibold leading-tight text-slate-50 sm:text-6xl">{copy.heading}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">{message ?? copy.body}</p>
        <Link
          to="/"
          className="mt-10 inline-flex rounded-md bg-archive-emerald px-6 py-3 text-sm font-semibold text-archive-night transition-colors hover:bg-archive-emerald-soft"
        >
          {copy.cta}
        </Link>
      </div>
    </section>
  );
}
