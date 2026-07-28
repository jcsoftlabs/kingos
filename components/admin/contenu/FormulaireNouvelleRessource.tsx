"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";
import { TeleverseurFichier } from "./TeleverseurFichier";

interface Categorie {
  id: string;
  nom: string;
}

export function FormulaireNouvelleRessource({ categories }: { categories: Categorie[] }) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [titre, setTitre] = useState("");
  const [slug, setSlug] = useState("");
  const [categorieId, setCategorieId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [auteur, setAuteur] = useState("");
  const [apercu, setApercu] = useState<{ publicId: string } | null>(null);
  const [fichier, setFichier] = useState<{ publicId: string; format: string; tailleOctets: number; resourceType: "image" | "raw" } | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!apercu || !fichier) {
      setErreur("Ajoutez l'aperçu et le fichier téléchargeable avant de créer la ressource");
      return;
    }
    if (!categorieId) {
      setErreur("Créez d'abord une catégorie de ressources");
      return;
    }
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/ressources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre,
          slug,
          categorieId,
          description: description || undefined,
          auteur: auteur || undefined,
          apercuPublicId: apercu.publicId,
          fichier,
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Création impossible");
        return;
      }
      setTitre("");
      setSlug("");
      setDescription("");
      setAuteur("");
      setApercu(null);
      setFichier(null);
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
      <button type="button" onClick={() => setOuvert(true)} className="text-sm font-bold text-magenta-500 hover:underline">
        + Nouvelle ressource
      </button>
    );
  }

  return (
    <form onSubmit={soumettre} className="space-y-3 rounded-marque border border-marine-100 bg-creme-200 p-4">
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="block text-xs font-bold text-marine-500">Titre</label>
          <input required value={titre} onChange={(e) => setTitre(e.target.value)} className="mt-1 w-48 rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Slug</label>
          <input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ex: gabarit-carte-visite" className="mt-1 w-48 rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Catégorie</label>
          <select required value={categorieId} onChange={(e) => setCategorieId(e.target.value)} className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm">
            {categories.length === 0 && <option value="">Aucune catégorie</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Auteur (facultatif)</label>
          <input value={auteur} onChange={(e) => setAuteur(e.target.value)} className="mt-1 w-40 rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-marine-500">Description (facultatif)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-wrap gap-6">
        <TeleverseurFichier type="ressource-apercu" slug={slug} label="Image d'aperçu" onTeleverse={(info) => setApercu({ publicId: info.publicId })} />
        <TeleverseurFichier
          type="ressource-fichier"
          slug={slug}
          resourceType="raw"
          label="Fichier téléchargeable"
          onTeleverse={(info) => setFichier(info)}
        />
      </div>
      {erreur && <p className="text-xs text-magenta-600">{erreur}</p>}
      <div className="flex gap-2">
        <Bouton taille="petit" disabled={enCours}>
          {enCours ? "…" : "Créer"}
        </Bouton>
        <button type="button" onClick={() => setOuvert(false)} className="text-xs text-marine-400">
          Annuler
        </button>
      </div>
    </form>
  );
}
