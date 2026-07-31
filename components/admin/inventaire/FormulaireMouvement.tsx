"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

const LIBELLES_TYPE: Record<string, string> = { ENTREE: "Entrée", SORTIE: "Sortie", AJUSTEMENT: "Ajustement (nouvelle quantité)" };

export function FormulaireMouvement({ articleId, unite }: { articleId: string; unite: string }) {
  const router = useRouter();
  const [type, setType] = useState<"ENTREE" | "SORTIE" | "AJUSTEMENT">("ENTREE");
  const [quantite, setQuantite] = useState("");
  const [motif, setMotif] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch(`/api/admin/inventaire/articles/${articleId}/mouvements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, quantite: Number(quantite), motif: motif || undefined }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Enregistrement impossible");
        return;
      }
      setQuantite("");
      setMotif("");
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-marine-500">Enregistrer un mouvement</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold text-marine-500">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          >
            {Object.entries(LIBELLES_TYPE).map(([valeur, libelle]) => (
              <option key={valeur} value={valeur}>
                {libelle}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">
            {type === "AJUSTEMENT" ? `Nouvelle quantité (${unite})` : `Quantité (${unite})`}
          </label>
          <input
            type="number"
            min={0}
            step="any"
            required
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Motif (optionnel)</label>
          <input
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Achat fournisseur, inventaire physique…"
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
      </div>
      {erreur && <p className="mt-2 text-sm text-magenta-600">{erreur}</p>}
      <div className="mt-4">
        <Bouton taille="petit" disabled={enCours || !quantite}>
          {enCours ? "…" : "Enregistrer"}
        </Bouton>
      </div>
    </form>
  );
}
