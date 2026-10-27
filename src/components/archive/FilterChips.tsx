import { useId } from "react";
import { motion } from "framer-motion";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

/** Row of single-choice filters; the emerald pill slides to the active one. */
export default function FilterChips<T extends string>({ options, value, onChange, label }: Props<T>) {
  const groupId = useId();

  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active ? "text-archive-night" : "text-slate-300 hover:text-slate-50"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`chip-${groupId}`}
                className="absolute inset-0 rounded-full bg-archive-emerald"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {!active && <span className="absolute inset-0 rounded-full border border-slate-700" aria-hidden />}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
