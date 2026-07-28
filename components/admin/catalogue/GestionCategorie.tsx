"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GestionCategorie({ categorieId, nom, nbServices }: { categorieId: string; nom: string; nbServices: number }) {
  const router = useRouter();
  const [edition, setEdition] = useState(false);
  const [valeur, setValeur] = useState(nom);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function renommer(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch(`/api/admin/catalogue/categories/${categorieId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: valeur }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Renommage impossible");
        return;
      }
      setEdition(false);
      router.refresh();
    } finally {
      setEnCours(false);
    }
  }

  async function supprimer() {
    if (nbServices > 0) {
      setErreur(`Retirez ou déplacez d'abord les ${nbServices} service(s) de cette catégorie.`);
      return;
    }
    setEnCours(true);
    try {
      await fetch(`/api/admin/catalogue/categories/${categorieId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setEnCours(false);
    }
  }

  if (edition) {
    return (
      <form onSubmit={renommer} className="flex items-center gap-2">
        <input
          value={valeur}
          onChange={(e) => setValeur(e.target.value)}
          className="rounded-marque border border-marine-100 px-2 py-1 text-sm font-extrabold uppercase tracking-wide text-marine-400"
        />
        <button type="submit" disabled={enCours} className="text-xs font-bold text-magenta-500">
          {enCours ? "…" : "OK"}
        </button>
        <button type="button" onClick={() => setEdition(false)} className="text-xs text-marine-400">
          Annuler
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <h2 className="text-sm font-extrabold uppercase tracking-wide text-marine-400">{nom}</h2>
      <button type="button" onClick={() => setEdition(true)} className="text-xs font-bold text-marine-300 hover:text-magenta-500">
        Renommer
      </button>
      <button type="button" onClick={supprimer} disabled={enCours} className="text-xs font-bold text-marine-300 hover:text-magenta-600">
        {enCours ? "…" : "Masquer la catégorie"}
      </button>
      {erreur && <span className="text-xs text-magenta-600">{erreur}</span>}
    </div>
  );
}
