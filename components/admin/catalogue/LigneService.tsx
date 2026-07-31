"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formaterHTG } from "@/lib/types-catalogue";
import { GestionAttributs } from "./GestionAttributs";
import { BoutonVisibilite } from "./BoutonVisibilite";

interface Option {
  id: string;
  valeur: string;
  libelle: string;
  coefficient: string | null;
  supplementCents: string | null;
}
interface Attribut {
  id: string;
  cle: string;
  libelle: string;
  type: string;
  obligatoire: boolean;
  options: Option[];
}
interface Service {
  id: string;
  slug: string;
  nom: string;
  resume: string;
  description: string;
  mode: string;
  prixBaseCents: string;
  unite: string | null;
  delaiJours: number;
  visible: boolean;
  attributs: Attribut[];
  articleInventaireId: string | null;
  consommationParUnite: string | null;
}

interface ArticleInventaire {
  id: string;
  nom: string;
  unite: string;
}

export function LigneService({ service, articles }: { service: Service; articles: ArticleInventaire[] }) {
  const router = useRouter();
  const [edition, setEdition] = useState(false);
  const [valeurs, setValeurs] = useState({
    nom: service.nom,
    resume: service.resume,
    description: service.description,
    prixBase: (Number(service.prixBaseCents) / 100).toString(),
    unite: service.unite ?? "",
    delaiJours: service.delaiJours,
    articleInventaireId: service.articleInventaireId ?? "",
    consommationParUnite: service.consommationParUnite ?? "",
  });
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch(`/api/admin/catalogue/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: valeurs.nom,
          resume: valeurs.resume,
          description: valeurs.description,
          prixBaseCents: Math.round(Number(valeurs.prixBase) * 100).toString(),
          unite: valeurs.unite || undefined,
          delaiJours: valeurs.delaiJours,
          articleInventaireId: valeurs.articleInventaireId || null,
          consommationParUnite: valeurs.articleInventaireId && valeurs.consommationParUnite ? Number(valeurs.consommationParUnite) : null,
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Enregistrement impossible");
        return;
      }
      setEdition(false);
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <>
      <tr className="transition-colors hover:bg-creme-100">
        <td className="px-5 py-3 font-bold text-marine-500">
          {service.nom}
          <div className="text-xs font-normal text-marine-400">{service.slug}</div>
        </td>
        <td className="px-5 py-3 text-marine-400">{service.mode}</td>
        <td className="px-5 py-3">
          <GestionAttributs serviceId={service.id} attributs={service.attributs} />
        </td>
        <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
          {formaterHTG(service.prixBaseCents)}
          {service.unite && <span className="font-normal text-marine-400"> / {service.unite}</span>}
        </td>
        <td className="px-5 py-3">
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => setEdition((v) => !v)} className="text-xs font-bold text-marine-400 hover:text-magenta-500 hover:underline">
              {edition ? "Fermer" : "Modifier"}
            </button>
            <BoutonVisibilite serviceId={service.id} visible={service.visible} />
          </div>
        </td>
      </tr>
      {edition && (
        <tr>
          <td colSpan={5} className="bg-creme-100 px-5 py-4">
            <form onSubmit={enregistrer} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-[10px] font-bold text-marine-500">Nom</label>
                <input
                  required
                  value={valeurs.nom}
                  onChange={(e) => setValeurs((v) => ({ ...v, nom: e.target.value }))}
                  className="mt-0.5 w-40 rounded-marque border border-marine-100 px-2 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-marine-500">Résumé</label>
                <input
                  required
                  value={valeurs.resume}
                  onChange={(e) => setValeurs((v) => ({ ...v, resume: e.target.value }))}
                  className="mt-0.5 w-56 rounded-marque border border-marine-100 px-2 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-marine-500">Prix de base (HTG)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={valeurs.prixBase}
                  onChange={(e) => setValeurs((v) => ({ ...v, prixBase: e.target.value }))}
                  className="mt-0.5 w-24 rounded-marque border border-marine-100 px-2 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-marine-500">Unité</label>
                <input
                  value={valeurs.unite}
                  onChange={(e) => setValeurs((v) => ({ ...v, unite: e.target.value }))}
                  placeholder="pied carré…"
                  className="mt-0.5 w-28 rounded-marque border border-marine-100 px-2 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-marine-500">Délai (jours)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={valeurs.delaiJours}
                  onChange={(e) => setValeurs((v) => ({ ...v, delaiJours: Number(e.target.value) }))}
                  className="mt-0.5 w-20 rounded-marque border border-marine-100 px-2 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-marine-500">Article consommé</label>
                <select
                  value={valeurs.articleInventaireId}
                  onChange={(e) => setValeurs((v) => ({ ...v, articleInventaireId: e.target.value }))}
                  className="mt-0.5 w-40 rounded-marque border border-marine-100 px-2 py-1.5 text-xs"
                >
                  <option value="">— Aucun —</option>
                  {articles.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nom}
                    </option>
                  ))}
                </select>
              </div>
              {valeurs.articleInventaireId && (
                <div>
                  <label className="block text-[10px] font-bold text-marine-500">
                    Consommation / {service.mode === "SURFACE" ? "pi²" : "unité"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={valeurs.consommationParUnite}
                    onChange={(e) => setValeurs((v) => ({ ...v, consommationParUnite: e.target.value }))}
                    className="mt-0.5 w-24 rounded-marque border border-marine-100 px-2 py-1.5 text-xs"
                  />
                </div>
              )}
              <div className="w-full">
                <label className="block text-[10px] font-bold text-marine-500">Description</label>
                <textarea
                  required
                  rows={2}
                  value={valeurs.description}
                  onChange={(e) => setValeurs((v) => ({ ...v, description: e.target.value }))}
                  className="mt-0.5 w-full rounded-marque border border-marine-100 px-2 py-1.5 text-xs"
                />
              </div>
              {erreur && <p className="text-xs text-magenta-600">{erreur}</p>}
              <button type="submit" disabled={enCours} className="rounded-marque bg-magenta-500 px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50">
                {enCours ? "…" : "Enregistrer"}
              </button>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}
