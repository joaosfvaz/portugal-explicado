/**
 * Minimal iCalendar (RFC 5545) file for all-day events. Used to add deadlines to a phone calendar.
 * The file is built in the browser; nothing is sent to a server.
 */

export type CalendarEvent = { uid: string; title: string; description: string; start: string; end: string; url?: string };

const compact = (iso: string) => iso.replaceAll("-", "");

function nextDay(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Escapes text and folds lines longer than 75 octets, as the format requires. */
function line(name: string, value: string) {
  const escaped = value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const full = `${name}:${escaped}`;
  const bytes = new TextEncoder().encode(full);
  if (bytes.length <= 75) return full;
  const out: string[] = [];
  let current = "";
  let size = 0;
  for (const ch of full) {
    const n = new TextEncoder().encode(ch).length;
    if (size + n > (out.length ? 74 : 75)) {
      out.push(current);
      current = "";
      size = 0;
    }
    current += ch;
    size += n;
  }
  out.push(current);
  return out.join("\r\n ");
}

export function toIcs(events: CalendarEvent[], stamp: string): string {
  const rows = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Portugal Explicado//Prazos//PT", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
  for (const e of events) {
    rows.push(
      "BEGIN:VEVENT",
      line("UID", `${e.uid}@portugal-explicado`),
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(e.start)}`,
      `DTEND;VALUE=DATE:${compact(nextDay(e.end))}`,
      line("SUMMARY", e.title),
      line("DESCRIPTION", e.description),
      ...(e.url ? [line("URL", e.url)] : []),
      "BEGIN:VALARM",
      "TRIGGER:-P7D",
      "ACTION:DISPLAY",
      line("DESCRIPTION", `Faltam 7 dias: ${e.title}`),
      "END:VALARM",
      "END:VEVENT",
    );
  }
  rows.push("END:VCALENDAR");
  return `${rows.join("\r\n")}\r\n`;
}
