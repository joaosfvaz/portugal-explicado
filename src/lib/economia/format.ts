/** Pure formatting helpers, safe for client components. */

export type ValueFormat = { unit: "%" | "p.p." | "€" | "€/l" | "pessoas" | "UE=100"; digits: number };

const MONTHS = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

export function periodLabel(period: string) {
  let m = period.match(/^(\d{4})-Q([1-4])$/);
  if (m) return `${m[2]}.º trim. ${m[1]}`;
  m = period.match(/^(\d{4})-S([12])$/);
  if (m) return `${m[2]}.º sem. ${m[1]}`;
  m = period.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  m = period.match(/^(\d{4})-(\d{2})$/);
  if (m) return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  return period;
}

/** Short axis label for charts. */
export function periodShort(period: string) {
  const q = period.match(/^(\d{4})-Q([1-4])$/);
  if (q) return `T${q[2]} ${q[1].slice(2)}`;
  const s = period.match(/^(\d{4})-S([12])$/);
  if (s) return `S${s[2]} ${s[1].slice(2)}`;
  const d = period.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (d) return `${MONTHS[Number(d[2]) - 1]} ${d[1].slice(2)}`;
  const mo = period.match(/^(\d{4})-(\d{2})$/);
  if (mo) return `${mo[2]}/${mo[1].slice(2)}`;
  return period;
}

/** Year of a period string, with a fraction for sub-annual periods. Used for time ranges. */
export function periodYear(period: string) {
  const year = Number(period.slice(0, 4));
  let m = period.match(/-Q([1-4])$/);
  if (m) return year + (Number(m[1]) - 1) / 4;
  m = period.match(/-S([12])$/);
  if (m) return year + (Number(m[1]) - 1) / 2;
  m = period.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (m) return year + (Number(m[1]) - 1) / 12 + (Number(m[2]) - 1) / 365;
  m = period.match(/^\d{4}-(\d{2})$/);
  if (m) return year + (Number(m[1]) - 1) / 12;
  return year;
}

export function formatValue(f: ValueFormat, value: number) {
  const n = value.toLocaleString("pt-PT", { minimumFractionDigits: f.digits, maximumFractionDigits: f.digits });
  if (f.unit === "%") return `${n}%`;
  if (f.unit === "€") return `${n} €`;
  if (f.unit === "€/l") return `${n} €/l`;
  if (f.unit === "pessoas") return value >= 1e6 ? `${(value / 1e6).toLocaleString("pt-PT", { maximumFractionDigits: 2 })} milhões` : n;
  return n;
}

export function formatChange(f: ValueFormat, latest: number, previous: number) {
  const diff = latest - previous;
  if (Math.abs(diff) < 10 ** -(f.digits + 1)) return "sem variação";
  const sign = diff > 0 ? "+" : "−";
  const abs = Math.abs(diff);
  if (f.unit === "%" || f.unit === "UE=100") {
    return `${sign}${abs.toLocaleString("pt-PT", { maximumFractionDigits: f.digits })} ${f.unit === "%" ? "p.p." : "pontos"}`;
  }
  const rel = previous ? (diff / previous) * 100 : 0;
  return `${sign}${Math.abs(rel).toLocaleString("pt-PT", { maximumFractionDigits: 1 })}%`;
}
