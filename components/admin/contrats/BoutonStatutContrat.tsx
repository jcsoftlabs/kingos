"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTIONS: { valeur: string; libelle: string }[] = [
  { valeur: "ACTIF", libelle: "Actif" },
  { valeur: "SUSPENDU", libelle: "Suspendu" },
  { valeur: "RESILIE", libelle: "Résilié" },
  { valeur: "EXPIRE", libelle: "Expiré" },
];

export function BoutonStatutContrat({ contratId, statut }: { contratId: string; statut: string }) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  async function changer(nouveauStatut: string) {
    if (nouveauStatut === statut) return;
    setEnCours(true);
    try {
      await fetch(`/api/admin/contrats/${contratId}/statut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      router.refresh();
    } finally {
      setEnCours(false);
    }
  }

  return (
    <select
      value={statut}
      disabled={enCours}
      onChange={(e) => changer(e.target.value)}
      className="rounded-marque border border-marine-100 px-3 py-1.5 text-xs font-bold text-marine-500 disabled:opacity-50"
    >
      {OPTIONS.map((o) => (
        <option key={o.valeur} value={o.valeur}>
          {o.libelle}
        </option>
      ))}
    </select>
  );
}
