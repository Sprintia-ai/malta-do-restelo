import { useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import { siteContent } from "@/data/timelineData";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

/** How far down (in pixels) the reader must scroll before the button appears. */
const SHOW_AFTER_PX = 600;

/**
 * "Voltar ao Topo": large, labelled, high-contrast button fixed to the bottom-right
 * corner. It appears once the page has been scrolled and simply shows or hides,
 * with no animation, so nothing moves unexpectedly.
 */
function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    // Throttle to one check per animation frame
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    // Smooth scroll, unless the reader has asked their device to reduce motion
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    // Keyboard and screen-reader users land at the start of the page too
    document.getElementById("conteudo")?.focus({ preventScroll: true });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed z-[90] inline-flex items-center gap-3 rounded-xl border-2 border-white bg-slate-900 px-7 py-5 text-xl font-bold text-white shadow-xl hover:bg-slate-700 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-amber-400 sm:text-2xl"
      style={{
        right: "max(1.25rem, calc(env(safe-area-inset-right, 0px) + 1rem))",
        bottom: "max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))",
      }}
    >
      <span aria-hidden="true" className="text-2xl leading-none sm:text-3xl">
        ↑
      </span>
      {siteContent.a11y.backToTop}
    </button>
  );
}

/** Wraps every page: header, footer, page transitions, scroll restoration and the "Voltar ao Topo" button. */
export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  // On every route change, start the new page at the top — unless the link points
  // to an in-page #hash, in which case scroll to that element instead. Without this,
  // the browser keeps the previous scroll position and the new page can open on
  // empty space below its content (the "I have to refresh to see it" problem).
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    // reducedMotion="user" honours the OS "reduce motion" setting site-wide
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-archive-night text-slate-100">
        <SiteHeader />
        {/* Keyed by path: each route mounts fresh and fades in. No exit animation,
            so a navigation never leaves the incoming page stuck invisible. */}
        <motion.main
          key={location.pathname}
          id="conteudo"
          // Focus target for the skip link and the "Voltar ao Topo" button
          tabIndex={-1}
          className="flex-1 focus:outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {outlet}
        </motion.main>
        <SiteFooter />
        {/* Room under the footer so the fixed button never covers its last links */}
        <div aria-hidden="true" className="h-28 shrink-0" />
        <BackToTopButton />
      </div>
    </MotionConfig>
  );
}
