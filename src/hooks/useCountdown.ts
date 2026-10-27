import { useEffect, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target time has passed. */
  done: boolean;
}

const split = (ms: number): CountdownParts => {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: false,
  };
};

/** Live countdown to an ISO date. Returns null when there is no date. */
export function useCountdown(isoDate: string | null): CountdownParts | null {
  const parsed = isoDate ? new Date(isoDate).getTime() : NaN;
  const target = Number.isNaN(parsed) ? null : parsed;
  // Current time, refreshed every second while there is a target
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (target === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return target === null ? null : split(target - now);
}
