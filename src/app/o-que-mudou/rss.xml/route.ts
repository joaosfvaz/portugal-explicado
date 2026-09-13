import { recentChanges } from "@/lib/o-que-mudou";

export const revalidate = 3600;

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const absolute = (href: string) => (href.startsWith("http") ? href : `${origin}${href}`);
  const items = recentChanges(60)
    .map(
      (i) => `    <item>
      <title>${escape(i.title)}</title>
      <link>${escape(absolute(i.href))}</link>
      <guid isPermaLink="false">${escape(`${i.kind}-${i.href}-${i.date}`)}</guid>
      <pubDate>${new Date(`${i.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(i.text)}</description>
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Portugal Explicado: o que mudou</title>
    <link>${origin}/o-que-mudou</link>
    <description>Regras novas, leis publicadas e números oficiais atualizados, em linguagem simples.</description>
    <language>pt-PT</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
