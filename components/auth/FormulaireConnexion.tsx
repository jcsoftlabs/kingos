"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bouton } from "@/components/Bouton";

export function FormulaireConnexion() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/auth/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motDePasse }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Connexion impossible");
        return;
      }
      router.refresh();
    } catch {
      setErreur("Erreur réseau — réessayez dans un instant");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="mx-auto max-w-sm space-y-4">
      <div>
        <label className="block text-sm font-bold text-marine-500">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-marine-500">Mot de passe</label>
        <input
          type="password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
        />
      </div>

      {erreur && <p className="text-sm text-magenta-600">{erreur}</p>}

      <Bouton taille="normal" className="w-full" disabled={enCours}>
        {enCours ? "Connexion…" : "Se connecter"}
      </Bouton>
    </form>
  );
}
