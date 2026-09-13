import { describe, expect, it } from "vitest";
import { activeItem, breadcrumbs, NAV } from "./nav";

const labels = (path: string) => breadcrumbs(path).map((c) => c.label);

describe("menu position of a path", () => {
  it("places pages by what they are about, not by URL", () => {
    expect(activeItem("/trabalho/salario-liquido")?.group.id).toBe("dinheiro");
    expect(activeItem("/vida/subsidio-de-desemprego")?.group.id).toBe("trabalho");
    expect(activeItem("/vida/burlas")?.group.id).toBe("ajuda");
  });

  it("places detail pages under the right parent", () => {
    expect(activeItem("/estado/municipios/braga")?.item?.href).toBe("/estado/municipios");
    expect(activeItem("/estado/eleicoes/legislativas-2025")?.item?.href).toBe("/estado/eleicoes");
    expect(activeItem("/parlamento/iniciativas/123")?.item?.href).toBe("/parlamento/iniciativas");
    expect(activeItem("/vida/vou/mudar-de-casa")?.item?.href).toBe("/vida/vou");
    expect(activeItem("/economia/gasolina-95")?.item?.href).toBe("/economia");
    expect(activeItem("/vida/nif")?.item?.href).toBe("/vida/nif");
    expect(activeItem("/estado/presidente")?.item?.href).toBe("/estado/presidente");
    expect(activeItem("/en/guides/tax-number-nif")?.item?.href).toBe("/en");
  });

  it("gives no item on a group's overview page", () => {
    const found = activeItem("/vida");
    expect(found?.group.id).toBe("papeis");
    expect(found?.item).toBeNull();
  });
});

describe("breadcrumbs", () => {
  it("builds the trail from the menu", () => {
    expect(labels("/casa/faturas")).toEqual(["Início", "Casa", "Faturas da casa"]);
    expect(labels("/estado/municipios/braga")).toEqual(["Início", "O país", "O meu município"]);
    expect(labels("/vida")).toEqual(["Início", "Papéis e serviços"]);
    expect(labels("/pesquisa")).toEqual(["Início", "Pesquisar"]);
  });

  it("marks only the current page, and keeps the parent as a link on detail pages", () => {
    const detail = breadcrumbs("/estado/municipios/braga");
    expect(detail.at(-1)).toMatchObject({ href: "/estado/municipios", current: false });
    expect(breadcrumbs("/casa/faturas").filter((c) => c.current)).toHaveLength(1);
  });

  it("has no trail on the home page or on pages outside the menu", () => {
    expect(breadcrumbs("/")).toEqual([]);
    expect(breadcrumbs("/marca")).toEqual([]);
  });

  it("keeps the menu short: at most six visible links per group", () => {
    for (const g of NAV) expect(g.items.filter((i) => !i.hidden).length).toBeLessThanOrEqual(6);
  });
});
