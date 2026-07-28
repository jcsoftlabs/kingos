import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

// L'en-tête et le pied de page publics vivent dans le groupe (site), pas ici :
// le back-office et son écran de connexion ne doivent afficher aucun élément
// du site vitrine.
export default function LayoutRacine({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
