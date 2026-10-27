import { siteContent } from "@/data/timelineData";
import { useCountdown } from "@/hooks/useCountdown";

interface Props {
  date: string;
  size?: "md" | "lg";
}

const copy = siteContent.nextLunchPage;

/** Days / hours / minutes / seconds until the lunch. */
export default function Countdown({ date, size = "lg" }: Props) {
  const parts = useCountdown(date);
  if (!parts) return null;

  if (parts.done) {
    return <p className="font-serif text-3xl text-archive-emerald">{copy.happeningNow}</p>;
  }

  const units: Array<[number, string]> = [
    [parts.days, copy.countdownUnits.days],
    [parts.hours, copy.countdownUnits.hours],
    [parts.minutes, copy.countdownUnits.minutes],
    [parts.seconds, copy.countdownUnits.seconds],
  ];

  const numberClass =
    size === "lg"
      ? "text-5xl sm:text-7xl"
      : "text-4xl sm:text-5xl";

  return (
    <dl className="grid grid-cols-4 gap-3 sm:gap-6" aria-live="off">
      {units.map(([value, label]) => (
        // dt must precede dd in the markup; flex-col-reverse puts the number on top visually
        <div key={label} className="flex flex-col-reverse border-l border-slate-800 pl-3 sm:pl-5">
          <dt className="mt-2 text-sm text-slate-500">{label}</dt>
          <dd className={`font-serif font-semibold leading-none tabular-nums text-slate-50 ${numberClass}`}>
            {String(value).padStart(2, "0")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
