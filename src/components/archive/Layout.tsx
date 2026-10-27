import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

/** Wraps every page: header, footer, page transitions and scroll restoration. */
export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  // After a route change, jump to the #hash target if there is one
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    // reducedMotion="user" honours the OS "reduce motion" setting site-wide
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-archive-night text-slate-100">
        <SiteHeader />
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => {
            if (!window.location.hash) window.scrollTo({ top: 0 });
          }}
        >
          <motion.main
            key={location.pathname}
            id="conteudo"
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {outlet}
          </motion.main>
        </AnimatePresence>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}
