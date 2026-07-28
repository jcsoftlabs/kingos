"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";
import { TeleverseurFichier } from "./TeleverseurFichier";

export function FormulaireNouvelleRealisation() {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [titre, setTitre] = useState("");
  const [slug, setSlug] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<{ publicId: string } | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setErreur("Ajoutez une image avant de créer la réalisation");
      return;
    }
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/realisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre,
          slug,
          client: client || undefined,
          description: description || undefined,
          publicIdPrincipal: image.publicId,
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Création impossible");
        return;
      }
      setTitre("");
      setSlug("");
      setClient("");
      setDescription("");
      setImage(null);
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
        + Nouvelle réalisation
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
          <input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ex: banniere-hotel-x" className="mt-1 w-48 rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Client (facultatif)</label>
          <input value={client} onChange={(e) => setClient(e.target.value)} className="mt-1 w-48 rounded-marque border border-marine-100 px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-marine-500">Description (facultatif)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
      </div>
      <TeleverseurFichier type="realisation" slug={slug} label="Image principale" onTeleverse={(info) => setImage({ publicId: info.publicId })} />
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
