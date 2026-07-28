"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconeTableauDeBord,
  IconePanier,
  IconeDevis,
  IconeFacture,
  IconeCatalogue,
  IconeUtilisateurs,
  IconeClients,
  IconeReglages,
  IconeJournal,
} from "@/components/icones/admin";
import { IconeEclair } from "@/components/icones";

const ICONES = {
  tableau: IconeTableauDeBord,
  panier: IconePanier,
  devis: IconeDevis,
  facture: IconeFacture,
  catalogue: IconeCatalogue,
  clients: IconeClients,
  utilisateurs: IconeUtilisateurs,
  reglages: IconeReglages,
  journal: IconeJournal,
  eclair: IconeEclair,
} as const;

export interface Section {
  titre: string;
  liens: { href: string; libelle: string; icone: keyof typeof ICONES }[];
}

export function NavigationAdmin({ sections }: { sections: Section[] }) {
  const chemin = usePathname();

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {sections.map((section) => (
        <div key={section.titre}>
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-marine-300">{section.titre}</p>
          <div className="space-y-0.5">
            {section.liens.map((lien) => {
              const Icone = ICONES[lien.icone];
              // Le tableau de bord est un préfixe de toutes les autres routes —
              // il ne doit s'activer que sur une correspondance exacte.
              const actif = lien.href === "/admin" ? chemin === "/admin" : chemin.startsWith(lien.href);
              return (
                <Link
                  key={lien.href}
                  href={lien.href}
                  aria-current={actif ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-marque px-3 py-2 text-sm font-semibold transition-colors ${
                    actif
                      ? "bg-magenta-500 text-white shadow-sm shadow-magenta-500/30"
                      : "text-marine-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icone className={`h-[18px] w-[18px] shrink-0 ${actif ? "text-white" : "text-marine-200"}`} />
                  {lien.libelle}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
