import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

/**
 * Search box that opens /pesquisa. A plain form, so it works before the page's JavaScript loads.
 * `size="lg"` is the big box on the home page and the search page.
 */
export function SearchForm({
  id,
  defaultValue,
  size = "md",
  autoFocus,
  className = "",
}: {
  id: string;
  defaultValue?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
  className?: string;
}) {
  const lg = size === "lg";
  return (
    <form action="/pesquisa" method="get" role="search" className={`flex w-full ${className}`}>
      <label htmlFor={id} className="sr-only">
        Pesquisar no site
      </label>
      <div className="relative min-w-0 flex-1">
        <MagnifyingGlass className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${lg ? "left-4 h-5 w-5" : "left-3 h-4 w-4"}`} aria-hidden />
        <input
          id={id}
          name="q"
          type="search"
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
          placeholder={lg ? "Ex.: recibo, renda, IRS" : "Pesquisar no site"}
          className={`w-full rounded-l-sm border border-r-0 border-line bg-surface text-foreground placeholder:text-muted focus:border-accent focus:outline-none ${lg ? "h-14 pr-3 pl-12 text-lg" : "h-9 pr-2 pl-9 text-sm"}`}
        />
      </div>
      <button type="submit" className={`pressable shrink-0 rounded-r-sm bg-accent font-medium text-on-accent ${lg ? "h-14 px-6 text-lg" : "h-9 px-3 text-sm"}`}>
        Pesquisar
      </button>
    </form>
  );
}
