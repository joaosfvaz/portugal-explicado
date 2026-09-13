"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { formatValue, periodLabel, periodShort, periodYear, type ValueFormat } from "@/lib/economia/format";

type Point = { period: string; value: number };
export type ChartSeries = { key: string; label: string; points: Point[] };

type Range = { id: string; label: string; years: number | null };

const RANGES: Record<string, Range[]> = {
  semanal: [
    { id: "6m", label: "6M", years: 0.5 },
    { id: "1a", label: "1A", years: 1 },
    { id: "5a", label: "5A", years: 5 },
    { id: "tudo", label: "Tudo", years: null },
  ],
  mensal: [
    { id: "1a", label: "1A", years: 1 },
    { id: "3a", label: "3A", years: 3 },
    { id: "tudo", label: "Tudo", years: null },
  ],
  trimestral: [
    { id: "3a", label: "3A", years: 3 },
    { id: "5a", label: "5A", years: 5 },
    { id: "tudo", label: "Tudo", years: null },
  ],
  anual: [
    { id: "5a", label: "5A", years: 5 },
    { id: "10a", label: "10A", years: 10 },
    { id: "tudo", label: "Tudo", years: null },
  ],
};

const COLORS = ["var(--accent)", "var(--foreground)", "var(--muted)"];
const HEIGHT = 320;
const PAD = { top: 16, right: 64, bottom: 30, left: 12 };

export function IndicatorChart({
  title,
  format,
  frequency,
  series,
  defaultRange,
  fileName,
}: {
  title: string;
  format: ValueFormat;
  frequency: keyof typeof RANGES;
  series: ChartSeries[];
  defaultRange?: string;
  fileName: string;
}) {
  const ranges = RANGES[frequency];
  const canCompare = series.length > 1;
  const [mode, setMode] = useState<"pt" | "compare">("pt");
  const [rangeId, setRangeId] = useState(defaultRange ?? ranges.at(-1)!.id);
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(720);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shown = mode === "compare" ? series : series.slice(0, 1);
  const range = ranges.find((r) => r.id === rangeId) ?? ranges.at(-1)!;

  const view = useMemo(() => {
    const last = series[0].points.at(-1);
    const from = range.years && last ? periodYear(last.period) - range.years : -Infinity;
    const lines = shown.map((s) => ({ ...s, points: s.points.filter((p) => periodYear(p.period) >= from - 1e-6) }));
    const periods = Array.from(new Set(lines.flatMap((l) => l.points.map((p) => p.period)))).sort();
    const values = lines.flatMap((l) => l.points.map((p) => p.value));
    return { lines, periods, values };
  }, [series, shown, range]);

  const { lines, periods, values } = view;
  if (periods.length < 2) return <p className="text-sm text-muted">Sem dados suficientes para o gráfico.</p>;

  let min = Math.min(...values);
  let max = Math.max(...values);
  if (max === min) {
    max += 1;
    min -= 1;
  }
  const span = max - min;
  min -= span * 0.08;
  max += span * 0.08;

  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / (periods.length - 1)) * innerW;
  const y = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * innerH;
  const index = new Map(periods.map((p, i) => [p, i]));
  const ticks = Array.from({ length: 4 }, (_, i) => min + ((max - min) * (i + 0.5)) / 4);
  const labelCount = Math.max(2, Math.floor(innerW / 110));
  const labelEvery = Math.ceil(periods.length / labelCount);
  const tick = (v: number) => v.toLocaleString("pt-PT", { maximumFractionDigits: Math.min(format.digits, Math.abs(max - min) < 1 ? 2 : 1) });

  const paths = lines.map((l) => {
    const pts = l.points.map((p) => [x(index.get(p.period)!), y(p.value)] as const);
    return { ...l, d: pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(""), pts };
  });
  const primary = paths[0];
  const area = primary.pts.length
    ? `${primary.d}L${primary.pts.at(-1)![0].toFixed(1)},${PAD.top + innerH}L${primary.pts[0][0].toFixed(1)},${PAD.top + innerH}Z`
    : "";
  const latest = lines[0].points.at(-1)!;

  const hoverPeriod = hover !== null ? periods[hover] : null;
  const hoverValues = hoverPeriod ? lines.map((l, i) => ({ label: l.label, color: COLORS[i], point: l.points.find((p) => p.period === hoverPeriod) })) : [];

  const onPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left - PAD.left) / innerW;
    setHover(Math.min(periods.length - 1, Math.max(0, Math.round(rel * (periods.length - 1)))));
  };
  const onKey = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const current = hover ?? periods.length - 1;
    const next = e.key === "Home" ? 0 : e.key === "End" ? periods.length - 1 : current + (e.key === "ArrowRight" ? 1 : -1);
    setHover(Math.min(periods.length - 1, Math.max(0, next)));
  };

  const download = () => {
    const all = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.period)))).sort();
    const rows = [["periodo", ...series.map((s) => s.label)].join(";")];
    for (const p of all) rows.push([p, ...series.map((s) => s.points.find((q) => q.period === p)?.value.toString().replace(".", ",") ?? "")].join(";"));
    const url = URL.createObjectURL(new Blob([`﻿${rows.join("\n")}`], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${fileName}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const tipLeft = hover !== null ? Math.min(Math.max(x(hover) - 90, 0), width - 180) : 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {canCompare && (
            <Segmented
              label="Séries"
              value={mode}
              onChange={(v) => setMode(v as "pt" | "compare")}
              options={[
                { id: "pt", label: "Portugal" },
                { id: "compare", label: "Comparar" },
              ]}
            />
          )}
          <Segmented label="Período" value={range.id} onChange={setRangeId} options={ranges} />
          <button type="button" onClick={download} className="pressable grid h-8 w-8 place-items-center rounded-sm bg-sunken text-muted hover:text-foreground" aria-label="Descarregar dados em CSV" title="Descarregar CSV">
            <DownloadSimple className="h-4 w-4" />
          </button>
        </div>
      </div>

      {mode === "compare" && (
        <ul className="mt-3 flex flex-wrap gap-4 text-sm">
          {lines.map((l, i) => (
            <li key={l.key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
              {l.label}
            </li>
          ))}
        </ul>
      )}

      <div ref={box} className="relative mt-4">
        <svg
          width={width}
          height={HEIGHT}
          className="block touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          role="img"
          tabIndex={0}
          aria-label={`${title}. Último valor: ${formatValue(format, latest.value)}, ${periodLabel(latest.period)}. Use as setas para ler cada ponto.`}
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKey}
          onBlur={() => setHover(null)}
        >
          <defs>
            <linearGradient id={`fill-${fileName}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={PAD.left + innerW} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray="2 4" />
              <text x={width - 4} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" className="tabular">
                {tick(t)}
              </text>
            </g>
          ))}
          {min < 0 && max > 0 && <line x1={PAD.left} x2={PAD.left + innerW} y1={y(0)} y2={y(0)} stroke="var(--muted)" />}
          {periods.map((p, i) =>
            i % labelEvery === 0 ? (
              <text key={p} x={x(i)} y={HEIGHT - 8} textAnchor={i === 0 ? "start" : "middle"} fontSize="11" fill="var(--muted)">
                {periodShort(p)}
              </text>
            ) : null,
          )}
          {mode === "pt" && <path d={area} fill={`url(#fill-${fileName})`} />}
          {paths.map((p, i) => (
            <path key={p.key} d={p.d} fill="none" stroke={COLORS[i]} strokeWidth={i === 0 ? 2 : 1.5} strokeLinejoin="round" strokeDasharray={i === 0 ? undefined : "5 4"} />
          ))}
          {hover !== null && (
            <>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--muted)" strokeDasharray="3 3" />
              {hoverValues.map((h) => h.point && <circle key={h.label} cx={x(hover)} cy={y(h.point.value)} r="4" fill="var(--surface)" stroke={h.color} strokeWidth="2" />)}
            </>
          )}
          <g transform={`translate(${PAD.left + innerW + 4}, ${y(latest.value) - 11})`}>
            <rect width={PAD.right - 6} height="22" rx="6" fill="var(--accent)" />
            <text x={(PAD.right - 6) / 2} y="15" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--on-accent)" className="tabular">
              {latest.value.toLocaleString("pt-PT", { minimumFractionDigits: format.digits, maximumFractionDigits: format.digits })}
            </text>
          </g>
        </svg>

        {hover !== null && hoverPeriod && (
          <div className="pointer-events-none absolute top-2 w-[180px] rounded-sm border border-line bg-surface px-3 py-2 text-sm" style={{ left: tipLeft }}>
            <p className="text-xs text-muted">{periodLabel(hoverPeriod)}</p>
            {hoverValues.map((h) => (
              <p key={h.label} className="mt-0.5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: h.color }} />
                  <span className="truncate">{h.label}</span>
                </span>
                <span className="font-semibold tabular">{h.point ? formatValue(format, h.point.value) : "-"}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Segmented({ label, value, onChange, options }: { label: string; value: string; onChange: (id: string) => void; options: { id: string; label: string }[] }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-sm bg-sunken p-0.5 text-sm">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={o.id === value}
          onClick={() => onChange(o.id)}
          className="rounded-sm px-2.5 py-1 text-muted transition-colors hover:text-foreground aria-checked:bg-surface aria-checked:font-semibold aria-checked:text-foreground aria-checked:shadow-sm"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
