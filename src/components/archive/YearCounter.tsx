import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface Props {
  from: number;
  to: number;
  /** Seconds. */
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * Counts up from one year to another, once. Screen readers get the final value;
 * with "reduce motion" on, the final value shows straight away.
 */
export default function YearCounter({ from, to, duration = 2.4, delay = 0.4, className }: Props) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [from, to, duration, delay, reduce]);

  return (
    <span className={className}>
      <span aria-hidden className="tabular-nums">
        {reduce ? to : value}
      </span>
      <span className="sr-only">{to}</span>
    </span>
  );
}
