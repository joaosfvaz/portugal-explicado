"use client";

import { useId, useState } from "react";
import { EuroInput, parseEuro } from "@/components/tax/bracket-calculator";
import { Choice, NumberField, ResultPanel, ResultRow, Toggle } from "@/components/forms/fields";
import { buildCosts } from "@/lib/casa/build";
import { eur } from "@/lib/format";

export function BuildCalculator() {
  const id = useId();
  const [land, setLand] = useState("90000");
  const [landType, setLandType] = useState<"construcao" | "rustico">("construcao");
  const [area, setArea] = useState("160");
  const [cost, setCost] = useState("");
  const [municipal, setMunicipal] = useState("");
  const [projects, setProjects] = useState("");
  const [own, setOwn] = useState(true);

  const r = buildCosts({ landPrice: parseEuro(land), landType, area: Number(area) || 0, costPerM2: parseEuro(cost), municipalFees: parseEuro(municipal), projectFees: parseEuro(projects), ownHome: own });
  const missing = !cost;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <form className="grid content-start gap-5" onSubmit={(e) => e.preventDefault()}>
        <EuroInput id={`${id}-land`} label="Preço do terreno" value={land} onChange={setLand} />
        <Choice
          label="Tipo de terreno"
          value={landType}
          onChange={setLandType}
          options={[
            { id: "construcao", label: "Terreno para construção", help: "IMT de 6,5%." },
            { id: "rustico", label: "Prédio rústico", help: "IMT de 5%. Pode não permitir construir." },
          ]}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField id={`${id}-area`} label="Área bruta de construção" value={area} onChange={setArea} min={0} suffix="m²" />
          <EuroInput id={`${id}-cost`} label="Preço da obra por m², sem IVA" value={cost} onChange={setCost} help="Use o valor dos orçamentos que pediu." />
          <EuroInput id={`${id}-mun`} label="Taxas municipais" value={municipal} onChange={setMunicipal} help="Veja o regulamento de taxas do seu município." />
          <EuroInput id={`${id}-proj`} label="Projetos e fiscalização" value={projects} onChange={setProjects} />
        </div>
        <Toggle id={`${id}-own`} label="Vai ser a sua habitação própria e permanente" checked={own} onChange={setOwn} help="Condição para a restituição parcial do IVA." />
      </form>

      <ResultPanel>
        <p className="text-sm text-muted">Custo total estimado</p>
        <p className="mt-1 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{eur(r.totalAfterRefund)}</p>
        {r.refund > 0 && <p className="mt-1 text-muted tabular">Depois da restituição de IVA. Antes: {eur(r.total)}.</p>}
        {missing && <p className="mt-3 rounded-sm bg-warn-soft px-3 py-2 text-sm text-warn">Indique o preço da obra por m². Não usamos um valor de mercado por defeito.</p>}
        <dl className="mt-5">
          <ResultRow label="Terreno" value={eur(parseEuro(land), 2)} />
          <ResultRow label="IMT do terreno" value={eur(r.imt, 2)} />
          <ResultRow label="Imposto do Selo do terreno (0,8%)" value={eur(r.selo, 2)} />
          <ResultRow label="Obra, sem IVA" value={eur(r.construction, 2)} />
          <ResultRow label="IVA da empreitada (23%)" value={eur(r.vat, 2)} />
          <ResultRow label="Taxas, projetos e fiscalização" value={eur(r.fees, 2)} />
          {r.refund > 0 && <ResultRow label="Restituição de IVA (23% para 6%)" value={`−${eur(r.refund, 2)}`} strong />}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {r.refundEligible
            ? "A restituição cobre a diferença entre 23% e 6% no IVA das empreitadas faturadas, não dos materiais comprados à parte. Pede-se à Autoridade Tributária até 12 meses depois do início da utilização e é paga em até 150 dias."
            : own
              ? "Sem restituição de IVA: o terreno mais a obra passam 660 982 €."
              : "A restituição de IVA só existe para habitação própria e permanente."}
        </p>
      </ResultPanel>
    </div>
  );
}
