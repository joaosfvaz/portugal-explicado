"use client";

import { Check, LinkSimple, ShareNetwork, WhatsappLogo } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

/**
 * Share the current page. Uses the phone's own share sheet when there is one; otherwise offers WhatsApp,
 * email and copying the link. Nothing is sent anywhere by the site itself.
 */
export function ShareButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState({ url: "", title: "" });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  async function share() {
    const url = window.location.href;
    const title = document.title;
    setPage({ url, title });
    if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // The person closed the share sheet, or sharing failed: show the other options.
      }
    }
    setOpen((o) => !o);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(page.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const text = encodeURIComponent(`${page.title}\n${page.url}`);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button type="button" onClick={share} aria-expanded={open} className="pressable inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface px-3 py-1.5 text-sm font-medium hover:border-accent">
        <ShareNetwork className="h-4 w-4" aria-hidden /> Partilhar
      </button>
      {open && (
        <div className="absolute left-0 z-40 mt-1.5 grid w-56 rounded-sm border border-line bg-surface p-1 text-sm">
          <a href={`https://wa.me/?text=${text}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-sm px-3 py-2 hover:bg-sunken">
            <WhatsappLogo className="h-4 w-4" aria-hidden /> WhatsApp
          </a>
          <a href={`mailto:?subject=${encodeURIComponent(page.title)}&body=${text}`} className="flex items-center gap-2 rounded-sm px-3 py-2 hover:bg-sunken">
            <ShareNetwork className="h-4 w-4" aria-hidden /> Email
          </a>
          <button type="button" onClick={copy} className="flex items-center gap-2 rounded-sm px-3 py-2 text-left hover:bg-sunken">
            {copied ? <Check className="h-4 w-4 text-accent" aria-hidden /> : <LinkSimple className="h-4 w-4" aria-hidden />}
            {copied ? "Ligação copiada" : "Copiar ligação"}
          </button>
        </div>
      )}
    </div>
  );
}
