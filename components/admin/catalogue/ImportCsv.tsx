"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const EN_TETE = [
  "categorie_slug", "categorie_nom", "service_slug", "service_nom", "resume", "description", "mode", "unite",
  "prix_base_htg", "prix_min_htg", "delai_jours", "surface_min_ft2", "quantite_min", "quantite_max",
  "fichier_requis", "visible",
];

const LIGNE_EXEMPLE = [
  "impression-grand-format", "Impression Grand Format", "banderole-vinyle", "Banderole Vinyle",
  "Banderole extérieure résistante", "Impression grand format sur vinyle 13oz, idéale pour événements et façades.",
  "SURFACE", "pied carré", "350", "0", "3", "6", "1", "", "oui", "oui",
];

function telechargerModele() {
  const contenu = [EN_TETE, LIGNE_EXEMPLE].map((ligne) => ligne.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const lien = document.createElement("a");
  lien.href = URL.createObjectURL(new Blob([contenu], { type: "text/csv;charset=utf-8" }));
  lien.download = "modele-catalogue-kingos.csv";
  lien.click();
  URL.revokeObjectURL(lien.href);
}

interface ResultatImport {
  categoriesCreees: number;
  servicesCrees: number;
  servicesModifies: number;
  erreurs: { ligne: number; message: string }[];
}

export function ImportCsv() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [enCours, setEnCours] = useState(false);
  const [resultat, setResultat] = useState<ResultatImport | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  async function importer(fichier: File) {
    setEnCours(true);
    setErreur(null);
    setResultat(null);
    try {
      const csv = await fichier.text();
      const reponse = await fetch("/api/admin/catalogue/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Import impossible");
        return;
      }
      setResultat(corps.donnees);
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-marque border border-marine-100 bg-creme-200 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-bold text-marine-500">Importer le catalogue depuis un CSV</h3>
        <button type="button" onClick={telechargerModele} className="text-xs font-bold text-magenta-500 hover:underline">
          Télécharger le modèle
        </button>
      </div>
      <p className="mt-1 text-xs text-marine-400">
        Une ligne = un service. Un service dont le <code>service_slug</code> existe déjà est mis à jour plutôt que
        dupliqué — on peut réimporter le même fichier corrigé sans risque. Les attributs (matériau, finitions…) se
        gèrent après import, service par service.
      </p>

      <div className="mt-3">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          disabled={enCours}
          onChange={(e) => {
            const fichier = e.target.files?.[0];
            if (fichier) void importer(fichier);
          }}
          className="text-sm"
        />
        {enCours && <span className="ml-2 text-xs text-marine-400">Import en cours…</span>}
      </div>

      {erreur && <p className="mt-2 text-sm text-magenta-600">{erreur}</p>}

      {resultat && (
        <div className="mt-3 rounded-marque bg-white p-3 text-sm">
          <p className="font-bold text-marine-500">
            {resultat.categoriesCreees} catégorie(s) créée(s), {resultat.servicesCrees} service(s) créé(s),{" "}
            {resultat.servicesModifies} mis à jour.
          </p>
          {resultat.erreurs.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-magenta-600">
              {resultat.erreurs.map((e, i) => (
                <li key={i}>
                  Ligne {e.ligne} : {e.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
