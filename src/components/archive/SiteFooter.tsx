import { Link } from "react-router-dom";
import { siteContent } from "@/data/timelineData";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-archive-night">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-serif text-2xl text-slate-100">{siteContent.title}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">{siteContent.footer.line}</p>
        </div>

        <nav aria-label={siteContent.a11y.mainNav}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {siteContent.nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-slate-400 transition-colors hover:text-archive-emerald">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
