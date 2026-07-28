"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

export function ActionsCheque({ paiementId }: { paiementId: string }) {
  const router = useRouter();
  const [rejetOuvert, setRejetOuvert] = useState(false);
  const [motif, setMotif] = useState("");
  const [enCours, setEnCours] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  async function appeler(cle: string, url: string, body?: string) {
    setEnCours(cle);
    setErreur(null);
    try {
      const reponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Action impossible");
        return;
      }
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(null);
    }
  }

  if (rejetOuvert) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          placeholder="Motif du rejet"
          className="rounded-marque border border-marine-100 px-2 py-1 text-xs"
        />
        <button
          type="button"
          disabled={!motif.trim() || enCours !== null}
          onClick={() => appeler("rejeter", `/api/admin/paiements/id/${paiementId}/rejeter`, JSON.stringify({ motif }))}
          className="text-xs font-bold text-magenta-600 disabled:opacity-50"
        >
          {enCours === "rejeter" ? "…" : "Confirmer"}
        </button>
        <button type="button" onClick={() => setRejetOuvert(false)} className="text-xs text-marine-400">
          Annuler
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {erreur && <span className="text-xs text-magenta-600">{erreur}</span>}
      <Bouton taille="petit" disabled={enCours !== null} onClick={() => appeler("encaisser", `/api/admin/paiements/id/${paiementId}/encaisser`)}>
        {enCours === "encaisser" ? "…" : "Encaisser"}
      </Bouton>
      <button type="button" onClick={() => setRejetOuvert(true)} className="text-xs font-bold text-magenta-600 hover:underline">
        Rejeter
      </button>
    </div>
  );
}
