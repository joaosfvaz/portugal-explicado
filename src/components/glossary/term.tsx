"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * A word with a short explanation. Tap or click opens a small box under the word; Escape, a second tap
 * or a tap elsewhere closes it. No animation: people open these often while reading.
 */
export function Term({ children, short, term, href }: { children: ReactNode; short: string; term: string; href: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const note = useRef<HTMLSpanElement>(null);

  // Keep the box inside the screen: shift it left when it would pass the right edge.
  useLayoutEffect(() => {
    const el = note.current;
    if (!open || !el) return;
    el.style.transform = "";
    const rect = el.getBoundingClientRect();
    const overflow = rect.right - (window.innerWidth - 8);
    const shift = overflow > 0 ? Math.min(overflow, rect.left - 8) : 0;
    if (shift > 0) el.style.transform = `translateX(-${shift}px)`;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="cursor-help text-inherit underline decoration-accent/60 decoration-dotted decoration-[1.5px] underline-offset-[3px] hover:decoration-accent"
      >
        {children}
      </button>
      {open && (
        <span
          ref={note}
          id={id}
          role="note"
          className="absolute top-full left-0 z-40 mt-1.5 block w-[min(20rem,80vw)] rounded-sm border border-line bg-surface p-3 text-left text-sm leading-relaxed font-normal text-foreground normal-case tracking-normal"
        >
          <span className="block font-semibold">{term}</span>
          <span className="mt-1 block text-muted">{short}</span>
          <Link href={href} className="mt-2 inline-block font-medium text-accent">
            Ver no glossário
          </Link>
        </span>
      )}
    </span>
  );
}
