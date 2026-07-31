"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

const OPTIONS = [
  { valeur: "NOUVELLE", libelle: "Nouvelle" },
  { valeur: "EN_COURS", libelle: "En cours" },
  { valeur: "TRAITEE", libelle: "Traitée" },
  { valeur: "REJETEE", libelle: "Rejetée" },
];

export function PanneauStatutDemande({
  demandeId,
  statut,
  notesInternes,
}: {
  demandeId: string;
  statut: string;
  notesInternes: string | null;
}) {
  const router = useRouter();
  const [valeurStatut, setValeurStatut] = useState(statut);
  const [notes, setNotes] = useState(notesInternes ?? "");
  const [enCours, setEnCours] = useState(false);
  const [succes, setSucces] = useState(false);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setSucces(false);
    try {
      await fetch(`/api/admin/demandes/${demandeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: valeurStatut, notesInternes: notes || null }),
      });
      setSucces(true);
      router.refresh();
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form onSubmit={enregistrer} className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-marine-500">Suivi</h2>
      <div className="mt-3">
        <label className="block text-xs font-bold text-marine-500">Statut</label>
        <select
          value={valeurStatut}
          onChange={(e) => setValeurStatut(e.target.value)}
          className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
        >
          {OPTIONS.map((o) => (
            <option key={o.valeur} value={o.valeur}>
              {o.libelle}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3">
        <label className="block text-xs font-bold text-marine-500">Notes internes</label>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ce qui a été convenu, prix estimé, prochaine étape…"
          className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Bouton taille="petit" disabled={enCours}>
          {enCours ? "…" : "Enregistrer"}
        </Bouton>
        {succes && <span className="text-xs font-bold text-foret-600">Enregistré.</span>}
      </div>
    </form>
  );
}
