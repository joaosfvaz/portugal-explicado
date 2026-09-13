import type { Metadata } from "next";
import { EB_Garamond, Geist, Geist_Mono } from "next/font/google";
import { NextSteps } from "@/components/shell/next-steps";
import { SectionTabs } from "@/components/shell/section-tabs";
import { SidebarNav } from "@/components/shell/sidebar";
import { TopBar } from "@/components/shell/top-bar";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const garamond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Portugal Explicado",
    template: "%s · Portugal Explicado",
  },
  description:
    "Impostos, Parlamento, leis, casa, economia e burocracia em Portugal explicados de forma simples, com fontes oficiais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-PT" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${garamond.variable} h-full antialiased`}>
      <head>
        {/* Applies the saved text size before the first paint, so the page does not jump. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("pe-text");if(t==="grande"||t==="maior")document.documentElement.dataset.text=t}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full font-sans">
        <TopBar />
        <div className="flex">
          <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-line bg-surface lg:block">
            <SidebarNav />
          </aside>
          <div className="flex min-h-[calc(100dvh-3.5rem)] min-w-0 flex-1 flex-col">
            <SectionTabs />
            <main className="flex-1">
              {children}
              <NextSteps />
            </main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
