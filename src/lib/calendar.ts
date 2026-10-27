/** Builds a downloadable .ics file so members can add the lunch to their calendar. */

interface CalendarEvent {
  title: string;
  /** ISO local date-time in Lisbon, e.g. "2026-12-12T13:00:00". */
  start: string;
  durationHours?: number;
  location?: string | null;
  description?: string | null;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-12-12T13:00:00" → "20261212T130000" (wall-clock, paired with TZID). */
function toIcsLocal(date: Date): string {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

function parseLocal(iso: string): Date {
  const [d, t = "00:00:00"] = iso.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const [hh, mm, ss = 0] = t.split(":").map(Number);
  return new Date(y, m - 1, day, hh, mm, ss);
}

const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`);

export function buildIcs(event: CalendarEvent): string {
  const start = parseLocal(event.start);
  const end = new Date(start.getTime() + (event.durationHours ?? 3) * 3600 * 1000);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Malta do Restelo//Almoco de Natal//PT",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:almoco-${toIcsLocal(start)}@malta-do-restelo`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Lisbon:${toIcsLocal(start)}`,
    `DTEND;TZID=Europe/Lisbon:${toIcsLocal(end)}`,
    `SUMMARY:${escape(event.title)}`,
    event.location ? `LOCATION:${escape(event.location)}` : "",
    event.description ? `DESCRIPTION:${escape(event.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

export function downloadIcs(event: CalendarEvent, fileName = "almoco-de-natal.ics"): void {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** "sábado, 12 de dezembro de 2026, 13:00" */
export function formatLunchDate(iso: string): string {
  const date = parseLocal(iso);
  const day = new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(date);
  return `${day}, ${time}`;
}
