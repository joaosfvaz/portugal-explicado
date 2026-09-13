import { GLOSSARY } from "../content/glossario";

type Matcher = { alias: string; id: string; caseSensitive: boolean };

// Longest aliases first, so "taxa de esforço" wins over "taxa". Acronyms (all capitals) match case-sensitively.
const MATCHERS: Matcher[] = GLOSSARY.flatMap((g) => g.match.map((alias) => ({ alias, id: g.id, caseSensitive: alias === alias.toUpperCase() && /\p{Lu}/u.test(alias) }))).sort(
  (a, b) => b.alias.length - a.alias.length,
);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PATTERN = new RegExp(`(?<![\\p{L}\\p{N}])(${MATCHERS.map((m) => escape(m.alias)).join("|")})(?![\\p{L}\\p{N}])`, "giu");

function findMatcher(found: string): Matcher | undefined {
  return MATCHERS.find((m) => (m.caseSensitive ? m.alias === found : m.alias.toLowerCase() === found.toLowerCase()));
}

/** Splits plain text into text and glossary terms. Each entry is linked at most once per call. */
export function glossParts(text: string, skip: Set<string> = new Set()): (string | { id: string; text: string })[] {
  const parts: (string | { id: string; text: string })[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    const matcher = findMatcher(m[0]);
    if (!matcher || skip.has(matcher.id)) continue;
    skip.add(matcher.id);
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push({ id: matcher.id, text: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

