"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

export function FormulaireNouvelleCategorie() {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/catalogue/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, slug }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Impossible de créer la catégorie");
        return;
      }
      setNom("");
      setSlug("");
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
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="text-sm font-bold text-magenta-500 hover:underline"
      >
        + Nouvelle catégorie
      </button>
    );
  }

  return (
    <form onSubmit={soumettre} className="flex flex-wrap items-end gap-3 rounded-marque border border-marine-100 bg-creme-200 p-4">
      <div>
        <label className="block text-xs font-bold text-marine-500">Nom</label>
        <input
          required
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-marine-500">Slug</label>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="ex: signaletique"
          className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm"
        />
      </div>
      {erreur && <p className="text-xs text-magenta-600">{erreur}</p>}
      <Bouton taille="petit" disabled={enCours}>
        {enCours ? "…" : "Créer"}
      </Bouton>
      <button type="button" onClick={() => setOuvert(false)} className="text-xs text-marine-400">
        Annuler
      </button>
    </form>
  );
}
