export type Series = {
  label: string;
  color: string;
  dashed?: boolean;
  points: { period: string; value: number }[];
};

/**
 * Small dependency-free SVG line chart. Periods are treated as ordered
 * categories shared by all series (e.g. "2019", "2020Q1", "2024-05").
 */
export function LineChart({
  series,
  unit = "",
  height = 240,
  digits = 1,
  formatPeriod = (p: string) => p,
}: {
  series: Series[];
  unit?: string;
  height?: number;
  digits?: number;
  formatPeriod?: (period: string) => string;
}) {
  const periods = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.period)))).sort();
  const values = series.flatMap((s) => s.points.map((p) => p.value));
  if (periods.length < 2 || values.length === 0) {
    return <p className="text-sm text-muted">Sem dados suficientes para o gráfico.</p>;
  }

  const width = 640;
  const pad = { top: 12, right: 12, bottom: 28, left: 48 };
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min > 0 && min / max > 0.3) min = min * 0.9;
  if (min > 0 && min / max <= 0.3) min = 0;
  if (max === min) max = min + 1;
  const span = max - min;
  min -= span * 0.05;
  max += span * 0.05;

  const x = (i: number) => pad.left + (i / (periods.length - 1)) * (width - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - (v - min) / (max - min)) * (height - pad.top - pad.bottom);
  const index = new Map(periods.map((p, i) => [p, i]));

  const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);
  const labelEvery = Math.ceil(periods.length / 6);
  const fmt = (v: number) => v.toLocaleString("pt-PT", { maximumFractionDigits: digits });

  return (
    <figure>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full min-w-[480px]" role="img" aria-label={series.map((s) => s.label).join(", ")}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke="var(--line)" />
              <text x={pad.left - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">
                {fmt(t)}
              </text>
            </g>
          ))}
          {min < 0 && max > 0 && <line x1={pad.left} x2={width - pad.right} y1={y(0)} y2={y(0)} stroke="var(--muted)" strokeDasharray="3 3" />}
          {periods.map((p, i) =>
            i % labelEvery === 0 || i === periods.length - 1 ? (
              <text key={p} x={x(i)} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">
                {formatPeriod(p)}
              </text>
            ) : null,
          )}
          {series.map((s) => {
            const pts = s.points
              .filter((p) => index.has(p.period))
              .sort((a, b) => index.get(a.period)! - index.get(b.period)!);
            const d = pts.map((p, i) => `${i ? "L" : "M"}${x(index.get(p.period)!).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
            const last = pts.at(-1);
            return (
              <g key={s.label}>
                <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeDasharray={s.dashed ? "5 4" : undefined} />
                {last && <circle cx={x(index.get(last.period)!)} cy={y(last.value)} r="3" fill={s.color} />}
                {pts.map((p) => (
                  <circle key={p.period} cx={x(index.get(p.period)!)} cy={y(p.value)} r="6" fill="transparent">
                    <title>{`${s.label}, ${formatPeriod(p.period)}: ${fmt(p.value)}${unit}`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      {series.length > 1 && (
        <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
          {series.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4" style={{ background: s.color, opacity: s.dashed ? 0.7 : 1 }} />
              {s.label}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
