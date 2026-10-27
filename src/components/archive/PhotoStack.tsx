import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { getAllStaticPhotos, siteContent } from "@/data/timelineData";
import PhotoPrint from "./PhotoPrint";

/** Final resting pose of each print once the stack has fanned out. */
const POSES = [
  { x: -92, y: 28, rotate: -9 },
  { x: 84, y: -18, rotate: 7 },
  { x: 0, y: 6, rotate: -1.5 },
];

function FanningPrint({
  progress,
  index,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  children: ReactNode;
}) {
  const pose = POSES[index % POSES.length];
  const x = useTransform(progress, [0, 1], [0, pose.x]);
  const y = useTransform(progress, [0, 1], [0, pose.y]);
  const rotate = useTransform(progress, [0, 1], [0, pose.rotate]);
  return (
    <motion.div style={{ x, y, rotate, zIndex: index }} className="absolute inset-x-0 top-0 mx-auto w-[78%]">
      {children}
    </motion.div>
  );
}

/** Home intro: a few prints that spread apart as the section scrolls into view. */
export default function PhotoStack() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const photos = getAllStaticPhotos().slice(0, 3);

  return (
    <section ref={ref} className="relative overflow-hidden bg-archive-night py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        <div className="max-w-xl">
          <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-5xl">
            {siteContent.home.introHeading}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">{siteContent.home.introBody}</p>
          <Link
            to="/sobre"
            className="mt-8 inline-block text-sm font-medium text-archive-emerald underline decoration-archive-emerald/40 underline-offset-[6px] transition-colors hover:text-archive-emerald-soft"
          >
            {siteContent.home.introLink}
          </Link>
        </div>

        <div className="relative mx-auto aspect-[5/4] w-full max-w-lg" aria-hidden={photos.length === 0}>
          {photos.map((photo, i) => (
            <FanningPrint key={photo.key} progress={scrollYProgress} index={i}>
              <PhotoPrint photo={photo} />
            </FanningPrint>
          ))}
        </div>
      </div>
    </section>
  );
}
