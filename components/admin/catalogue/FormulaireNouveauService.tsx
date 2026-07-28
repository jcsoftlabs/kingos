"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

interface Categorie {
  id: string;
  nom: string;
}

const MODES = [
  { valeur: "SURFACE", libelle: "Surface (prix au pied²)" },
  { valeur: "QUANTITE", libelle: "Quantité (prix à la pièce)" },
  { valeur: "FORFAIT", libelle: "Forfait (prix fixe)" },
  { valeur: "SUR_DEVIS", libelle: "Sur devis (chiffrage manuel)" },
];

export function FormulaireNouveauService({ categories }: { categories: Categorie[] }) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [champs, setChamps] = useState({
    categorieId: categories[0]?.id ?? "",
    slug: "",
    nom: "",
    resume: "",
    description: "",
    mode: "SURFACE",
    unite: "",
    prixBaseCents: "",
    prixMinCents: "0",
    delaiJours: "3",
  });

  function majChamp(cle: keyof typeof champs) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setChamps((c) => ({ ...c, [cle]: e.target.value }));
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/catalogue/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...champs,
          prixBaseCents: champs.prixBaseCents || "0",
          delaiJours: Number(champs.delaiJours),
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Impossible de créer le service");
        return;
      }
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
      <Bouton taille="petit" onClick={() => setOuvert(true)}>
        + Nouveau service
      </Bouton>
    );
  }

  return (
    <form onSubmit={soumettre} className="mt-4 space-y-4 rounded-marque border border-marine-100 bg-creme-200 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-marine-500">Catégorie</label>
          <select value={champs.categorieId} onChange={majChamp("categorieId")} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Mode de tarification</label>
          <select value={champs.mode} onChange={majChamp("mode")} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm">
            {MODES.map((m) => (
              <option key={m.valeur} value={m.valeur}>
                {m.libelle}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Nom</label>
          <input required value={champs.nom} onChange={majChamp("nom")} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Slug</label>
          <input required value={champs.slug} onChange={majChamp("slug")} placeholder="ex: panneau-pvc" className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-marine-500">Résumé (une phrase)</label>
        <input required value={champs.resume} onChange={majChamp("resume")} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-bold text-marine-500">Description</label>
        <textarea required rows={3} value={champs.description} onChange={majChamp("description")} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="block text-xs font-bold text-marine-500">Unité</label>
          <input value={champs.unite} onChange={majChamp("unite")} placeholder="pied carré, pièce…" className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Prix de base (centimes)</label>
          <input type="number" value={champs.prixBaseCents} onChange={majChamp("prixBaseCents")} placeholder="35000" className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Prix plancher (centimes)</label>
          <input type="number" value={champs.prixMinCents} onChange={majChamp("prixMinCents")} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Délai (jours)</label>
          <input type="number" value={champs.delaiJours} onChange={majChamp("delaiJours")} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
      </div>

      <p className="text-xs text-marine-400">
        Les options (matériaux, finitions…) et paliers de quantité se configurent après création — pour l&apos;instant
        via l&apos;API. Un service SURFACE sans option reste utilisable en devis instantané dès sa création.
      </p>

      {erreur && <p className="text-sm text-magenta-600">{erreur}</p>}

      <div className="flex gap-3">
        <Bouton taille="normal" disabled={enCours}>
          {enCours ? "Création…" : "Créer le service"}
        </Bouton>
        <button type="button" onClick={() => setOuvert(false)} className="text-sm text-marine-400">
          Annuler
        </button>
      </div>
    </form>
  );
}
