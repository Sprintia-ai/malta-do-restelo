import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { getDecadeGroups, siteContent } from "@/data/timelineData";

/**
 * Sticky "Saltar para a década:" menu, designed for readers aged 70+.
 *
 * - Sticks to the top of the screen while the page scrolls below it.
 * - Buttons wrap onto extra lines on small screens: every decade is always
 *   visible, nothing is hidden in a sideways-scrolling row.
 * - Large, bold, high-contrast buttons; the decade being read is shown solid dark.
 * - Publishes its own height as the CSS variable --decade-menu-h, so the decade
 *   sections it jumps to can stop just below it instead of hiding under it.
 */

const copy = siteContent.decadeMenu;

const focusRing =
  "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#7A1F2B]";

/** Smoothly scrolls a decade section into view (instantly with reduced motion) and moves focus to its heading. */
function scrollToDecade(anchorId: string) {
  const target = document.getElementById(anchorId);
  if (!target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  // Screen-reader and keyboard users continue reading from the decade heading
  target.querySelector<HTMLElement>("[data-decade-heading]")?.focus({ preventScroll: true });
}

export default function DecadeMenu() {
  const groups = useMemo(() => getDecadeGroups(), []);
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Publish the menu's height (it changes when the buttons wrap) for scroll offsets
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const root = document.documentElement;
    const publish = () => root.style.setProperty("--decade-menu-h", `${nav.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(nav);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--decade-menu-h");
    };
  }, []);

  // Highlight the decade whose section is currently just below the menu
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const menuBottom = navRef.current?.getBoundingClientRect().bottom ?? 0;
      let current: string | null = null;
      for (const group of groups) {
        const section = document.getElementById(group.anchorId);
        if (section && section.getBoundingClientRect().top <= menuBottom + 24) current = group.anchorId;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [groups]);

  const onJump = (e: MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    e.preventDefault();
    setActiveId(anchorId);
    scrollToDecade(anchorId);
  };

  return (
    <nav
      ref={navRef}
      aria-label={copy.navLabel}
      className="sticky top-0 z-40 border-b-2 border-slate-300 bg-stone-50 shadow-md"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <p id="decade-menu-label" className="mb-3 text-xl font-bold text-slate-900">
          {copy.label}
        </p>
        <ul aria-labelledby="decade-menu-label" className="flex flex-wrap gap-2 sm:gap-3">
          {groups.map((group) => {
            const isActive = group.anchorId === activeId;
            return (
              <li key={group.anchorId}>
                <a
                  href={`#${group.anchorId}`}
                  onClick={(e) => onJump(e, group.anchorId)}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex min-h-[3rem] items-center rounded-lg border-2 border-slate-900 px-5 py-3 text-lg font-bold leading-none ${focusRing} ${
                    isActive ? "bg-slate-900 text-white" : "bg-white text-slate-900 hover:bg-stone-200"
                  }`}
                >
                  {group.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
