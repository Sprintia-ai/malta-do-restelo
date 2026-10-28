import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteContent } from "@/data/timelineData";

const linkBase =
  "relative text-sm font-medium tracking-wide transition-colors duration-200 hover:text-archive-emerald";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  // Pinned to the top at all times. Transparent over the hero, solid once scrolled.
  const [scrolled, setScrolled] = useState(() => (typeof window !== "undefined" ? window.scrollY > 8 : false));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const solid = open || scrolled;

  return (
    <header
      // Fixed: the menu stays frozen at the top of the viewport while the page scrolls.
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-slate-800/80 bg-archive-night/95 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-archive-emerald focus:px-3 focus:py-2 focus:text-archive-night"
      >
        {siteContent.a11y.skipToContent}
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-archive-emerald" aria-hidden />
          <span className="font-serif text-lg font-semibold tracking-tight text-slate-50">
            {siteContent.brand}
          </span>
        </Link>

        <nav aria-label={siteContent.a11y.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {siteContent.nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? "text-archive-emerald" : "text-slate-300"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-1.5 left-0 right-0 h-px bg-archive-emerald"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? siteContent.a11y.closeMenu : siteContent.a11y.openMenu}
          className="rounded-md p-2 text-slate-200 transition-colors hover:text-archive-emerald lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label={siteContent.a11y.mainNav}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-slate-800 lg:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
              {siteContent.nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block border-l-2 py-2.5 pl-3 text-base transition-colors ${
                        isActive
                          ? "border-archive-emerald text-archive-emerald"
                          : "border-transparent text-slate-300 hover:text-slate-50"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
