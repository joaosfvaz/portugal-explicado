import type { Point } from "@/lib/economia/jsonstat";

export function Sparkline({ points, className = "" }: { points: Point[]; className?: string }) {
  if (points.length < 2) return null;
  const w = 120;
  const h = 36;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const d = points
    .map((p, i) => `${i ? "L" : "M"}${((i / (points.length - 1)) * w).toFixed(1)},${(h - 3 - ((p.value - min) / span) * (h - 6)).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-9 w-full ${className}`} preserveAspectRatio="none" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
