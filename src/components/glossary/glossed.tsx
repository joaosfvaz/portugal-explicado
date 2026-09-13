import { Fragment, type ReactNode } from "react";
import { GLOSSARY } from "@/content/glossario";
import { glossParts } from "@/lib/glossary";
import { Term } from "./term";

/**
 * Plain text with glossary words marked. Pass `skip` to share one set across several calls on the same
 * block, so a word is explained once per block and not on every line.
 */
export function Glossed({ children, skip }: { children: string; skip?: Set<string> }): ReactNode {
  return (
    <>
      {glossParts(children, skip).map((p, i) => {
        if (typeof p === "string") return <Fragment key={i}>{p}</Fragment>;
        const entry = GLOSSARY.find((g) => g.id === p.id)!;
        return (
          <Term key={i} term={entry.term} short={entry.short} href={`/glossario#${entry.id}`}>
            {p.text}
          </Term>
        );
      })}
    </>
  );
}
