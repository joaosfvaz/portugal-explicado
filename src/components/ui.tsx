import type { ReactNode } from "react";
import { HeaderTile } from "@/components/brand/header-tile";
import { Cercadura, type TileName } from "@/components/brand/tiles";
import { ShareButton } from "@/components/share-button";
import { Breadcrumbs } from "@/components/shell/breadcrumbs";
import { formatDate } from "@/lib/format";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

/** Header band shared by all pages: content at the left, the section tile panel at the right, a tile border below. */
export function HeaderFrame({ children, tile, className = "pt-8 pb-10 sm:pt-10", as: Tag = "div" }: { children: ReactNode; tile?: TileName; className?: string; as?: "div" | "header" }) {
  return (
    <Tag className="border-b border-line bg-surface">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 hidden w-[max(12rem,calc((100%-72rem)/2+13rem))] border-l border-line text-accent md:block">
          <HeaderTile tile={tile} />
        </div>
        <Container className={`relative md:pr-60 ${className}`}>
          <Breadcrumbs className="mb-4" />
          {children}
          <ShareButton className="mt-5" />
        </Container>
      </div>
      <div className="border-t border-line text-accent">
        <Cercadura id="page-header-band" height={12} />
      </div>
    </Tag>
  );
}

export function PageHeader({
  title,
  lead,
  children,
  tile,
}: {
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
  /** Tile shown as a panel at the right. Defaults to the tile of the current section. */
  tile?: TileName;
}) {
  return (
    <HeaderFrame tile={tile}>
      <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-medium tracking-[-0.015em] text-balance sm:text-5xl">{title}</h1>
      {lead && <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-muted">{lead}</p>}
      {children}
    </HeaderFrame>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-sm border border-line bg-surface ${className}`}>{children}</div>;
}

type Tone = "neutral" | "good" | "warn" | "bad";

const TONES: Record<Tone, string> = {
  neutral: "bg-sunken text-foreground",
  good: "bg-accent-soft text-accent-strong",
  warn: "bg-warn-soft text-warn",
  bad: "bg-danger-soft text-danger",
};

const RULES: Record<Tone, string> = {
  neutral: "border-muted",
  good: "border-accent",
  warn: "border-warn",
  bad: "border-danger",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium whitespace-nowrap ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function Notice({ children, tone = "warn", title }: { children: ReactNode; tone?: Tone; title?: string }) {
  return (
    <div className={`border-l-2 px-4 py-3 text-sm leading-relaxed ${TONES[tone]} ${RULES[tone]}`}>
      {title && <p className="mb-0.5 font-semibold">{title}</p>}
      <div className="text-foreground/85">{children}</div>
    </div>
  );
}

export type SourceRef = { title: string; url: string; verifiedOn?: string; verification?: string };

const VERIFICATION_LABEL: Record<string, { label: string; tone: Tone }> = {
  primary: { label: "Fonte oficial", tone: "good" },
  derived: { label: "Calculado a partir da lei", tone: "good" },
  secondary: { label: "A confirmar", tone: "warn" },
  uncertain: { label: "Incerto", tone: "bad" },
};

export function SourceList({ sources, heading = "Fontes" }: { sources: SourceRef[]; heading?: string }) {
  return (
    <section className="mt-10 border-t border-line pt-6">
      <h2 className="text-sm font-semibold">{heading}</h2>
      <ul className="mt-3 space-y-2.5 text-sm">
        {sources.map((s) => {
          const v = s.verification ? VERIFICATION_LABEL[s.verification] : undefined;
          return (
            <li key={`${s.title}-${s.url}`} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-line underline-offset-4 hover:decoration-accent">
                {s.title}
              </a>
              {v && <Badge tone={v.tone}>{v.label}</Badge>}
              {s.verifiedOn && <span className="text-xs text-muted">verificado em {formatDate(s.verifiedOn)}</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-sm border border-dashed border-line bg-surface px-6 py-12 text-center">
      <p className="font-semibold">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-muted">{children}</div>}
    </div>
  );
}
