import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Entete } from "@/components/Entete";
import { PiedDePage } from "@/components/PiedDePage";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL_SITE ?? "https://kingos.ht"),
  title: { default: "Kingo's — Impression grand format, textile & conception graphique", template: "%s | Kingo's" },
  description:
    "Kingo's — impression grand format, textile et conception graphique en Haïti. Devis instantané, commande en ligne, paiement MonCash et carte.",
  openGraph: {
    type: "website",
    locale: "fr_HT",
    siteName: "Kingo's",
  },
};

export default function LayoutRacine({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Entete />
        <main className="flex-1">{children}</main>
        <div className="print:hidden">
          <PiedDePage />
        </div>
      </body>
    </html>
  );
}
