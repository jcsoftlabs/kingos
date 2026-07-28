"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

const ROLES = [
  { valeur: "ADMIN", libelle: "Administrateur" },
  { valeur: "COMMERCIAL", libelle: "Commercial" },
  { valeur: "PRODUCTION", libelle: "Production" },
  { valeur: "LECTURE", libelle: "Lecture seule" },
];

export function FormulaireNouvelUtilisateur() {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [role, setRole] = useState("COMMERCIAL");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [motDePasseGenere, setMotDePasseGenere] = useState<{ email: string; motDePasse: string } | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nom, prenom: prenom || undefined, role }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Impossible de créer le compte");
        return;
      }
      setMotDePasseGenere({ email, motDePasse: corps.donnees.motDePasseTemporaire });
      setEmail("");
      setNom("");
      setPrenom("");
      setOuvert(false);
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  if (motDePasseGenere) {
    return (
      <div className="rounded-marque border border-lime bg-creme-200 p-4 text-sm">
        <p className="font-bold text-marine-500">
          Compte créé pour {motDePasseGenere.email}. Transmettez ce mot de passe temporaire au titulaire — il ne sera
          plus jamais affiché :
        </p>
        <p className="mt-2 rounded-marque bg-white px-3 py-2 font-mono text-magenta-600">{motDePasseGenere.motDePasse}</p>
        <button
          type="button"
          onClick={() => setMotDePasseGenere(null)}
          className="mt-3 text-xs font-bold text-marine-400 hover:underline"
        >
          Fermer
        </button>
      </div>
    );
  }

  if (!ouvert) {
    return (
      <button type="button" onClick={() => setOuvert(true)} className="text-sm font-bold text-magenta-500 hover:underline">
        + Nouveau compte
      </button>
    );
  }

  return (
    <form onSubmit={soumettre} className="flex flex-wrap items-end gap-3 rounded-marque border border-marine-100 bg-creme-200 p-4">
      <div>
        <label className="block text-xs font-bold text-marine-500">Prénom</label>
        <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-bold text-marine-500">Nom</label>
        <input required value={nom} onChange={(e) => setNom(e.target.value)} className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-bold text-marine-500">E-mail</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-marine-500">Rôle</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm">
          {ROLES.map((r) => (
            <option key={r.valeur} value={r.valeur}>
              {r.libelle}
            </option>
          ))}
        </select>
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
