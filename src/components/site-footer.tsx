import Link from "next/link";
import { Cercadura, Lockup } from "@/components/brand/tiles";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="border-b border-line text-accent">
        <Cercadura id="footer-band" height={16} />
      </div>
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <Link href="/" aria-label="Portugal Explicado, página inicial">
          <Lockup size="sm" tagline="Leis, contas e instituições, com fonte" />
        </Link>
      </div>
      <div className="mx-auto grid max-w-6xl gap-2 px-4 py-8 sm:px-6 text-sm text-muted">
        <p>
          Informação explicativa, baseada em fontes oficiais. Não substitui aconselhamento profissional,
          a Autoridade Tributária nem os textos legais publicados no Diário da República.
        </p>
        <p>
          <Link href="/fontes" className="underline underline-offset-2 hover:text-foreground">
            Ver todas as fontes e datas de verificação
          </Link>
        </p>
      </div>
    </footer>
  );
}
