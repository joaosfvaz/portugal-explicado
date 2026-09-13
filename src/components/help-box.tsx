import Link from "next/link";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { CONTACTS, HELP_SETS, type Contact } from "@/content/contactos";

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export function ContactCard({ c }: { c: Contact }) {
  return (
    <div className="bg-surface p-4">
      <p className="font-semibold">{c.org}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{c.what}</p>
      {c.phone && (
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <a href={tel(c.phone)} className="inline-flex items-center gap-1.5 font-display text-2xl font-medium text-accent figures">
            <Phone className="h-5 w-5" aria-hidden /> {c.phone}
          </a>
          {c.phoneAlt && (c.phoneAlt.startsWith("SMS") ? <span className="text-sm text-muted">ou {c.phoneAlt}</span> : <a href={tel(c.phoneAlt)} className="text-sm text-muted underline underline-offset-2">ou {c.phoneAlt}</a>)}
        </p>
      )}
      {c.hours && <p className="mt-1 text-sm text-muted">{c.hours}</p>}
      {c.cost && <p className="mt-0.5 text-xs text-muted">{c.cost}</p>}
      {c.url && (
        <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-medium text-accent underline underline-offset-4">
          {c.urlLabel ?? "Site oficial"}
        </a>
      )}
    </div>
  );
}

/** "Ainda tem dúvidas?" block with the official help lines for a topic. */
export function HelpBox({ topic, title = "Ainda tem dúvidas? Onde pedir ajuda" }: { topic: keyof typeof HELP_SETS; title?: string }) {
  const list = HELP_SETS[topic].map((id) => CONTACTS[id]).filter(Boolean);
  return (
    <section aria-label={title} className="rounded-sm border border-line">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line bg-sunken px-4 py-3">
        <h2 className="font-display text-2xl font-medium">{title}</h2>
        <Link href="/vida/ajuda" className="text-sm font-medium text-accent">
          Todos os contactos
        </Link>
      </div>
      <div className={`grid gap-px bg-line ${list.length > 2 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2"}`}>
        {list.map((c) => (
          <ContactCard key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}
