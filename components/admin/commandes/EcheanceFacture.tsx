"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EcheanceFacture({ factureId, echeanceLe }: { factureId: string; echeanceLe: string | null }) {
  const router = useRouter();
  const [edition, setEdition] = useState(false);
  const [valeur, setValeur] = useState(echeanceLe ? echeanceLe.slice(0, 10) : "");
  const [enCours, setEnCours] = useState(false);

  async function enregistrer() {
    setEnCours(true);
    try {
      await fetch(`/api/admin/factures/id/${factureId}/echeance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ echeanceLe: valeur || null }),
      });
      setEdition(false);
      router.refresh();
    } finally {
      setEnCours(false);
    }
  }

  if (!edition) {
    // L'échéance vient d'un <input type="date"> : "2026-09-30" est analysé
    // comme minuit UTC, sans heure associée — c'est une date calendaire, pas
    // un instant. La convertir vers un fuseau (même Haïti, UTC-5) recule
    // d'un jour dès que l'heure locale de minuit UTC tombe la veille.
    // Il faut donc la relire en UTC, jamais dans un fuseau local.
    return (
      <button type="button" onClick={() => setEdition(true)} className="text-xs font-bold text-marine-400 hover:text-magenta-500 hover:underline">
        {echeanceLe
          ? `Échéance : ${new Date(echeanceLe).toLocaleDateString("fr-HT", { timeZone: "UTC" })}`
          : "Fixer une échéance"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={valeur}
        onChange={(e) => setValeur(e.target.value)}
        className="rounded-marque border border-marine-100 px-2 py-1 text-xs"
      />
      <button type="button" onClick={enregistrer} disabled={enCours} className="text-xs font-bold text-magenta-500">
        {enCours ? "…" : "OK"}
      </button>
      <button type="button" onClick={() => setEdition(false)} className="text-xs text-marine-400">
        Annuler
      </button>
    </div>
  );
}
