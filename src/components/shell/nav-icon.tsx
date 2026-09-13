"use client";

import { BookOpen, Briefcase, Coins, Columns, Files, House, MagnifyingGlass, ShieldCheck, SquaresFour, UserCircle } from "@phosphor-icons/react";
import type { NavIcon } from "@/lib/nav";

const ICONS = {
  home: SquaresFour,
  search: MagnifyingGlass,
  person: UserCircle,
  coins: Coins,
  briefcase: Briefcase,
  house: House,
  papers: Files,
  shield: ShieldCheck,
  columns: Columns,
  book: BookOpen,
};

export function NavGlyph({ icon, className }: { icon: NavIcon; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} weight="regular" aria-hidden />;
}
