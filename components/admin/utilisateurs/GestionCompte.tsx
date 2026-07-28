"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BoutonActivation } from "./BoutonActivation";

const ROLES = [
  { valeur: "ADMIN", libelle: "Administrateur" },
  { valeur: "COMMERCIAL", libelle: "Commercial" },
  { valeur: "PRODUCTION", libelle: "Production" },
  { valeur: "LECTURE", libelle: "Lecture seule" },
];

export function GestionCompte({ utilisateurId, role, actif }: { utilisateurId: string; role: string; actif: boolean }) {
  const router = useRouter();
  const [editionRole, setEditionRole] = useState(false);
  const [nouveauRole, setNouveauRole] = useState(role);
  const [motDePasseGenere, setMotDePasseGenere] = useState<string | null>(null);
  const [enCours, setEnCours] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  async function changerRole() {
    setEnCours("role");
    setErreur(null);
    try {
      const reponse = await fetch(`/api/admin/utilisateurs/${utilisateurId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nouveauRole }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Modification impossible");
        return;
      }
      setEditionRole(false);
      router.refresh();
    } finally {
      setEnCours(null);
    }
  }

  async function reinitialiserMotDePasse() {
    setEnCours("motdepasse");
    setErreur(null);
    try {
      const reponse = await fetch(`/api/admin/utilisateurs/${utilisateurId}/reinitialiser-mot-de-passe`, { method: "POST" });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Réinitialisation impossible");
        return;
      }
      setMotDePasseGenere(corps.donnees.motDePasseTemporaire);
    } finally {
      setEnCours(null);
    }
  }

  if (motDePasseGenere) {
    return (
      <div className="rounded-marque border border-lime bg-creme-200 p-2 text-xs">
        <p className="font-bold text-marine-500">Nouveau mot de passe temporaire — à transmettre maintenant :</p>
        <p className="mt-1 rounded bg-white px-2 py-1 font-mono text-magenta-600">{motDePasseGenere}</p>
        <button type="button" onClick={() => setMotDePasseGenere(null)} className="mt-1 font-bold text-marine-400">
          Fermer
        </button>
      </div>
    );
  }

  if (editionRole) {
    return (
      <div className="flex items-center gap-2">
        <select value={nouveauRole} onChange={(e) => setNouveauRole(e.target.value)} className="rounded-marque border border-marine-100 px-2 py-1 text-xs">
          {ROLES.map((r) => (
            <option key={r.valeur} value={r.valeur}>
              {r.libelle}
            </option>
          ))}
        </select>
        <button type="button" onClick={changerRole} disabled={enCours !== null} className="text-xs font-bold text-magenta-500">
          {enCours === "role" ? "…" : "OK"}
        </button>
        <button type="button" onClick={() => setEditionRole(false)} className="text-xs text-marine-400">
          Annuler
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-3">
      {erreur && <span className="text-xs text-magenta-600">{erreur}</span>}
      <button type="button" onClick={() => setEditionRole(true)} className="text-xs font-bold text-marine-400 hover:text-magenta-500 hover:underline">
        Rôle
      </button>
      <button type="button" onClick={reinitialiserMotDePasse} disabled={enCours !== null} className="text-xs font-bold text-marine-400 hover:text-magenta-500 hover:underline">
        {enCours === "motdepasse" ? "…" : "Réinitialiser mot de passe"}
      </button>
      <BoutonActivation utilisateurId={utilisateurId} actif={actif} />
    </div>
  );
}
