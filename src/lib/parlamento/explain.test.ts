import { describe, expect, it } from "vitest";
import { explainStatus, phaseInfo, progressLabel, stageReached, stageStates, LAW_STAGES } from "./explain";
import { citedActs } from "./status";

const ev = (phase: string, date = "2026-01-01", result?: "Aprovado" | "Rejeitado") => ({
  phase,
  date,
  note: null,
  publication: null,
  votes: result ? [{ id: phase, date, result, unanimous: false, description: null, parties: null, absences: null }] : [],
});
const fmt = (d: string) => d;
const base = { statusPhase: null, statusDate: null, decrees: [], enteredOn: "2026-01-01" };

describe("stages", () => {
  it("takes the highest stage reached in the trail", () => {
    expect(stageReached([ev("Entrada"), ev("Baixa comissão especialidade"), ev("Admissão")], "J")).toBe(2);
    expect(stageReached([ev("Entrada"), ev("Votação na generalidade")], "R")).toBe(2);
    expect(stageReached([ev("Entrada")], "A")).toBeNull();
  });

  it("marks the stage where a rejected initiative ended", () => {
    expect(stageStates(LAW_STAGES, 1, "rejeitada")).toEqual(["done", "ended", "todo", "todo", "todo", "todo"]);
    expect(stageStates(LAW_STAGES, 5, "publicada").every((s) => s === "done")).toBe(true);
  });

  it("shows progress only for initiatives in progress", () => {
    expect(progressLabel({ typeCode: "J", stage: 2, status: "em-curso" })).toBe("Fase 3 de 6: Especialidade na comissão");
    expect(progressLabel({ typeCode: "J", stage: 1, status: "rejeitada" })).toBeNull();
  });

  it("keeps the official name for unknown phases", () => {
    expect(phaseInfo("Fase desconhecida").label).toBe("Fase desconhecida");
    expect(phaseInfo("Parecer do Governo da RAM").label).toBe("Parecer das regiões autónomas");
  });
});

describe("explainStatus", () => {
  it("says an approved bill waits for the President after it is sent", () => {
    const events = [ev("Votação final global", "2026-03-01", "Aprovado"), ev("Decreto (Publicação)", "2026-03-10"), ev("Envio para promulgação", "2026-03-12")];
    const r = explainStatus({ ...base, typeCode: "J", status: "aprovada", statusPhase: "Votação final global", statusDate: "2026-03-01", events }, fmt);
    expect(r.headline).toBe("Aprovada. Aguarda o Presidente da República.");
  });

  it("does not guess a next step when the decree is published but not yet sent", () => {
    const events = [ev("Votação final global", "2026-03-01", "Aprovado"), ev("Decreto (Publicação)", "2026-03-10")];
    const r = explainStatus({ ...base, typeCode: "J", status: "aprovada", statusPhase: "Votação final global", statusDate: "2026-03-01", events }, fmt);
    expect(r.headline).toBe("Aprovada em votação final.");
  });

  it("gives no next step for initiatives with several decrees", () => {
    const r = explainStatus({ ...base, typeCode: "P", status: "aprovada", decrees: ["1/XVII", "2/XVII"], events: [] }, fmt);
    expect(r.body).toBeNull();
  });

  it("names the vote where a bill was rejected", () => {
    const r = explainStatus(
      { ...base, typeCode: "J", status: "rejeitada", statusPhase: "Votação na generalidade", statusDate: "2026-02-02", events: [ev("Votação na generalidade", "2026-02-02", "Rejeitado")] },
      fmt,
    );
    expect(r.body).toBe("Foi rejeitada na votação na generalidade a 2026-02-02. O processo terminou.");
  });

  it("explains a bill approved in generality that is in committee", () => {
    const r = explainStatus({ ...base, typeCode: "J", status: "em-curso", events: [ev("Votação na generalidade", "2026-02-02", "Aprovado"), ev("Baixa comissão especialidade")] }, fmt);
    expect(r.headline).toBe("Aprovada na generalidade. Está na comissão.");
  });
});

describe("citedActs", () => {
  it("quotes act numbers from titles", () => {
    expect(citedActs("Altera a Lei n.º 37/81, de 3 de outubro, e o Decreto-Lei n.º 176/2009, de 4 de agosto")).toEqual(["Lei n.º 37/81", "Decreto-Lei n.º 176/2009"]);
    expect(citedActs("Recomenda ao Governo que reforce o SNS")).toEqual([]);
  });
});

import { nextStep } from "./explain";

describe("nextStep", () => {
  it("explains the next law stage and closed processes", () => {
    expect(nextStep("em-curso", "J", 0)).toContain("generalidade");
    expect(nextStep("em-curso", "P", 3)).toContain("Presidente");
    expect(nextStep("publicada", "J", 5)).toContain("terminou");
    expect(nextStep("em-curso", "X", 0)).toBeNull();
  });
});
