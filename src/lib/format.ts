export const eur = (n: number, digits = 0) =>
  n.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const pct = (n: number, digits = 1) =>
  `${(n * 100).toLocaleString("pt-PT", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;

export const num = (n: number, digits = 0) =>
  n.toLocaleString("pt-PT", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function formatDate(iso: string) {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Lisbon" });
}
