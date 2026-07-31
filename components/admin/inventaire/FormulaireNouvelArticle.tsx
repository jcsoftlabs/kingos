"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

const VALEURS_INITIALES = { nom: "", categorie: "", unite: "", quantiteActuelle: "0", seuilAlerte: "0", notes: "" };

export function FormulaireNouvelArticle() {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [valeurs, setValeurs] = useState(VALEURS_INITIALES);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function creer(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/inventaire/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: valeurs.nom,
          categorie: valeurs.categorie || null,
          unite: valeurs.unite,
          quantiteActuelle: Number(valeurs.quantiteActuelle),
          seuilAlerte: Number(valeurs.seuilAlerte),
          notes: valeurs.notes || null,
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Création impossible");
        return;
      }
      setValeurs(VALEURS_INITIALES);
      setOuvert(false);
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  if (!ouvert) {
    return (
      <Bouton taille="petit" variante="secondaire" onClick={() => setOuvert(true)}>
        Nouvel article
      </Bouton>
    );
  }

  return (
    <form onSubmit={creer} className="mb-5 rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-marine-500">Nouvel article</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-marine-500">Nom</label>
          <input
            required
            value={valeurs.nom}
            onChange={(e) => setValeurs((v) => ({ ...v, nom: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Catégorie</label>
          <input
            value={valeurs.categorie}
            onChange={(e) => setValeurs((v) => ({ ...v, categorie: e.target.value }))}
            placeholder="Grand format, Textile…"
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Unité</label>
          <input
            required
            value={valeurs.unite}
            onChange={(e) => setValeurs((v) => ({ ...v, unite: e.target.value }))}
            placeholder="pi², rouleau, pièce…"
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Seuil d&apos;alerte</label>
          <input
            type="number"
            min={0}
            step="any"
            required
            value={valeurs.seuilAlerte}
            onChange={(e) => setValeurs((v) => ({ ...v, seuilAlerte: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Quantité initiale</label>
          <input
            type="number"
            min={0}
            step="any"
            required
            value={valeurs.quantiteActuelle}
            onChange={(e) => setValeurs((v) => ({ ...v, quantiteActuelle: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-marine-500">Notes (optionnel)</label>
          <input
            value={valeurs.notes}
            onChange={(e) => setValeurs((v) => ({ ...v, notes: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {erreur && <p className="mt-2 text-sm text-magenta-600">{erreur}</p>}

      <div className="mt-4 flex gap-2">
        <Bouton taille="petit" disabled={enCours}>
          {enCours ? "…" : "Créer l'article"}
        </Bouton>
        <button
          type="button"
          onClick={() => {
            setOuvert(false);
            setErreur(null);
          }}
          className="text-xs text-marine-400"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
