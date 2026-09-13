export type VotePosition = "favor" | "contra" | "abstencao";

export const VOTE_POSITIONS: VotePosition[] = ["favor", "contra", "abstencao"];

export type PartyVotes = Record<VotePosition, string[]> & {
  /** Part of a group voted in this position: "6-PSD" means 6 PSD deputies. */
  partial: { position: VotePosition; party: string; count: number }[];
  /** Deputies named individually, usually the members of a partial group. */
  deputies: { position: VotePosition; name: string; party: string }[];
};

const LABELS: Record<string, VotePosition> = {
  "a favor": "favor",
  contra: "contra",
  "abstenção": "abstencao",
  abstencao: "abstencao",
};

/**
 * Parses the AR "detalhe" HTML string, e.g.
 * `A Favor: <I>6-PSD</I>, <I> CH</I>, <I> Paulo Moniz (PSD)</I><BR>Contra:<I>PSD</I>`.
 * - a plain acronym is the whole group, minus any partial count of that group elsewhere;
 * - "6-PSD" is a partial group: 6 PSD deputies voted in this position;
 * - "Name (PSD)" names a deputy of that partial group.
 */
export function parseVoteDetail(detail: string | null | undefined): PartyVotes | null {
  if (!detail) return null;
  const result: PartyVotes = { favor: [], contra: [], abstencao: [], partial: [], deputies: [] };
  let matched = false;
  for (const chunk of detail.split(/<br\s*\/?>/i)) {
    const colon = chunk.indexOf(":");
    if (colon === -1) continue;
    const label = chunk.slice(0, colon).replace(/<[^>]+>/g, "").trim().toLowerCase();
    const position = LABELS[label];
    if (!position) continue;
    const entries = chunk
      .slice(colon + 1)
      .split(/<\/i>/i)
      .map((part) => part.replace(/<[^>]+>/g, "").replace(/^[\s,]+|[\s,]+$/g, ""))
      .filter(Boolean);
    for (const entry of entries) {
      const partial = entry.match(/^(\d+)\s*-\s*(.+)$/);
      const deputy = entry.match(/^(.+?)\s*\(([^()]+)\)$/);
      if (partial) result.partial.push({ position, party: partial[2].trim(), count: Number(partial[1]) });
      else if (deputy) result.deputies.push({ position, name: deputy[1].trim(), party: deputy[2].trim() });
      else result[position].push(entry);
    }
    matched = true;
  }
  return matched ? result : null;
}

export type SeatCount = Record<VotePosition, number> & { total: number; unknown: number };

/**
 * Estimates deputies per position from the current seats of each group.
 * A whole group counts its seats minus the members counted as partial elsewhere.
 * This is an estimate: seats can change during the legislature and absences are not removed.
 */
export function estimateSeats(parties: PartyVotes, seats: Record<string, number>): SeatCount {
  const total = Object.values(seats).reduce((s, n) => s + n, 0);
  const count: SeatCount = { favor: 0, contra: 0, abstencao: 0, total, unknown: 0 };
  const partialByParty: Record<string, number> = {};
  for (const p of parties.partial) {
    if (!(p.party in seats)) continue;
    count[p.position] += p.count;
    partialByParty[p.party] = (partialByParty[p.party] ?? 0) + p.count;
  }
  for (const position of VOTE_POSITIONS) {
    for (const party of parties[position]) {
      if (!(party in seats)) continue;
      count[position] += Math.max(0, seats[party] - (partialByParty[party] ?? 0));
    }
  }
  count.unknown = Math.max(0, total - count.favor - count.contra - count.abstencao);
  return count;
}
