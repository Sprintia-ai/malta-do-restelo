import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import {
  FOUNDING_YEAR,
  HERO_IMAGE,
  currentYear,
  siteContent,
  yearsOfTradition,
} from "@/data/timelineData";
import YearCounter from "./YearCounter";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden bg-archive-night">
      <motion.div style={{ y: imageY, scale: imageScale }} className="photo-grain absolute inset-0" aria-hidden>
        <img
          src={HERO_IMAGE.src}
          alt=""
          className="h-full w-full object-cover object-center saturate-[0.8]"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* Legibility: dark from the bottom and the left */}
      <div className="absolute inset-0 bg-gradient-to-t from-archive-night via-archive-night/75 to-archive-night/25" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-archive-night/70 via-archive-night/20 to-transparent" aria-hidden />
      {/* Keeps the navigation readable over bright windows at the top of a photo */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-archive-night/90 via-archive-night/50 to-transparent" aria-hidden />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-32 sm:px-6 sm:pb-24 lg:grid-cols-[1.4fr_1fr] lg:items-end"
      >
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl font-serif text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-slate-50 sm:text-6xl lg:text-7xl"
          >
            {siteContent.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl"
          >
            {siteContent.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <a
              href={`#${siteContent.timeline.anchorId}`}
              className="group inline-flex items-center gap-3 rounded-md bg-archive-emerald px-6 py-3 text-sm font-semibold text-archive-night transition-colors duration-200 hover:bg-archive-emerald-soft"
            >
              {siteContent.hero.cta}
              <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden />
            </a>
            <Link
              to="/arquivo"
              className="text-sm font-medium text-slate-200 underline decoration-archive-emerald/60 underline-offset-[6px] transition-colors hover:text-archive-emerald"
            >
              {siteContent.hero.secondaryCta}
            </Link>
          </motion.div>
        </div>

        {/* The one orchestrated moment: the tradition counting itself up */}
        <div className="lg:text-right">
          <YearCounter
            from={FOUNDING_YEAR}
            to={currentYear()}
            className="block font-serif text-[5.5rem] font-semibold leading-none tracking-tight text-archive-emerald sm:text-[8rem] lg:text-[10rem]"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.8 }}
            className="mt-3 text-base text-slate-300"
          >
            {siteContent.hero.yearsLabel(yearsOfTradition())}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
