import { describe, expect, it } from "vitest";
import { decreesOf, deriveStatus } from "./status";
import { estimateSeats, parseVoteDetail } from "./votes";

const ev = (phase: string, date: string, result?: "Aprovado" | "Rejeitado") => ({
  phase,
  date,
  votes: result
    ? [{ id: date, date, result, unanimous: false, description: null, parties: null, absences: null }]
    : [],
});

describe("parseVoteDetail", () => {
  it("parses party groups", () => {
    const r = parseVoteDetail("A Favor: <I>PSD</I>, <I> CH</I>, <I> IL</I><BR>Contra:<I>PS</I>, <I> L</I><BR>Abstenção:<I>JPP</I>");
    expect(r).toMatchObject({ favor: ["PSD", "CH", "IL"], contra: ["PS", "L"], abstencao: ["JPP"], partial: [], deputies: [] });
  });

  it("keeps partial group counts and named deputies apart from whole groups", () => {
    const r = parseVoteDetail(
      "A Favor: <I>2-PSD</I>, <I> CH</I>, <I> Paulo Moniz (PSD)</I>, <I> Nuna Menezes (PSD)</I><BR>Contra:<I>PSD</I>, <I> CDS-PP</I>",
    );
    expect(r).toMatchObject({
      favor: ["CH"],
      contra: ["PSD", "CDS-PP"],
      partial: [{ position: "favor", party: "PSD", count: 2 }],
      deputies: [
        { position: "favor", name: "Paulo Moniz", party: "PSD" },
        { position: "favor", name: "Nuna Menezes", party: "PSD" },
      ],
    });
  });

  it("estimates deputies per position from current seats", () => {
    const r = parseVoteDetail("A Favor: <I>2-PSD</I>, <I> CH</I><BR>Contra:<I>PSD</I><BR>Abstenção:<I>XX</I>")!;
    expect(estimateSeats(r, { PSD: 89, CH: 60, PS: 58 })).toEqual({ favor: 62, contra: 87, abstencao: 0, total: 207, unknown: 58 });
  });

  it("keeps party names with hyphens", () => {
    expect(parseVoteDetail("A Favor: <I>CDS-PP</I>")?.favor).toEqual(["CDS-PP"]);
  });

  it("returns null for empty detail (unanimous votes)", () => {
    expect(parseVoteDetail(null)).toBeNull();
    expect(parseVoteDetail("")).toBeNull();
  });
});

describe("deriveStatus", () => {
  it("is in progress with no decisive events", () => {
    expect(deriveStatus([ev("Entrada", "2025-06-25"), ev("Admissão", "2025-06-26")], "J", "Projeto de Lei").status).toBe("em-curso");
  });

  it("does not treat approval on generalidade as final for bills", () => {
    expect(deriveStatus([ev("Votação na generalidade", "2025-07-01", "Aprovado")], "J", "Projeto de Lei").status).toBe("em-curso");
  });

  it("treats approval on generalidade as final for resolutions", () => {
    expect(deriveStatus([ev("Votação na generalidade", "2025-07-01", "Aprovado")], "R", "Projeto de Resolução").status).toBe("aprovada");
  });

  it("rejection on generalidade ends a bill", () => {
    const r = deriveStatus([ev("Entrada", "2025-06-01"), ev("Votação na generalidade", "2025-07-01", "Rejeitado")], "J", "Projeto de Lei");
    expect(r).toEqual({ status: "rejeitada", phase: "Votação na generalidade", date: "2025-07-01" });
  });

  it("a rejected specialty vote does not end the bill", () => {
    const r = deriveStatus(
      [ev("Votação na generalidade", "2025-07-01", "Aprovado"), ev("Votação na especialidade", "2025-09-01", "Rejeitado")],
      "J",
      "Projeto de Lei",
    );
    expect(r.status).toBe("em-curso");
  });

  it("follows the nationality law trail: approved, vetoed, approved again, published", () => {
    const r = deriveStatus(
      [
        ev("Entrada", "2025-06-25"),
        ev("Votação final global", "2025-10-28", "Aprovado"),
        ev("Veto (Receção)", "2025-12-19"),
        ev("Votação novo decreto", "2026-03-10", "Aprovado"),
        ev("Lei (Publicação DR)", "2026-05-18"),
      ],
      "P",
      "Proposta de Lei",
    );
    expect(r).toEqual({ status: "publicada", phase: "Lei (Publicação DR)", date: "2026-05-18" });
  });

  it("marks a veto without a new vote as vetoed", () => {
    const r = deriveStatus([ev("Votação final global", "2025-10-28", "Aprovado"), ev("Veto (Receção)", "2025-12-19")], "P", "Proposta de Lei");
    expect(r.status).toBe("vetada");
  });

  it("marks withdrawn initiatives", () => {
    expect(deriveStatus([ev("Entrada", "2025-06-25"), ev("Retirada da iniciativa", "2025-07-02")], "J", "Projeto de Lei").status).toBe("retirada");
  });

  it("orders events by date regardless of input order", () => {
    const r = deriveStatus([ev("Lei (Publicação DR)", "2026-01-10"), ev("Votação final global", "2025-12-01", "Aprovado")], "J", "Projeto de Lei");
    expect(r.status).toBe("publicada");
  });

  it("keeps publication final when a second decree from the same initiative fails later", () => {
    const r = deriveStatus(
      [
        ev("Votação final global", "2025-10-28", "Aprovado"),
        ev("Veto (Receção)", "2025-12-19"),
        ev("Lei (Publicação DR)", "2026-05-18"),
        ev("Veto (Receção)", "2026-05-13"),
        ev("Confirmação do decreto", "2026-07-03", "Rejeitado"),
      ],
      "P",
      "Proposta de Lei",
    );
    expect(r).toEqual({ status: "publicada", phase: "Lei (Publicação DR)", date: "2026-05-18" });
  });

  it("treats a failed confirmation after a veto as vetoed, not rejected", () => {
    const r = deriveStatus([ev("Veto (Receção)", "2026-05-13"), ev("Confirmação do decreto", "2026-07-03", "Rejeitado")], "J", "Projeto de Lei");
    expect(r.status).toBe("vetada");
  });
});

describe("decreesOf", () => {
  it("finds distinct decree numbers", () => {
    expect(
      decreesOf([
        { note: "Decreto n.º 17/XVII" },
        { note: "Decreto n.º 18/XVII - Acórdão do Tribunal Constitucional" },
        { note: "Decreto da Assembleia da República n.º 49/XVII/1.ª" },
        { note: null },
        { note: "Decreto n.º 17/XVII" },
      ]),
    ).toEqual(["17/XVII", "18/XVII", "49/XVII"]);
  });
});
