import type { Metadata } from "next";
import { Suspense } from "react";
import { searchDocs } from "@/lib/search/index";
import { SearchFromUrl, SearchView } from "./search-view";

export const metadata: Metadata = {
  title: "Pesquisar",
  description: "Procure em todas as páginas, guias, palavras difíceis, números e municípios do Portugal Explicado.",
};

export default function PesquisaPage() {
  // The page is static: the index is sent with it and the query in ?q= is searched in the browser.
  return (
    <Suspense fallback={<SearchView q="" results={[]} partial={false} />}>
      <SearchFromUrl docs={searchDocs()} />
    </Suspense>
  );
}
