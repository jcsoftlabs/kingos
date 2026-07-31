"use client";

import { useState } from "react";
import { Bouton } from "@/components/Bouton";

export function FormulaireDemande() {
  const [champs, setChamps] = useState({ nomContact: "", emailContact: "", telContact: "", description: "" });
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoye, setEnvoye] = useState(false);

  function majChamp(cle: keyof typeof champs) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setChamps((c) => ({ ...c, [cle]: e.target.value }));
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...champs, telContact: champs.telContact || undefined }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Impossible d'envoyer la demande");
        return;
      }
      setEnvoye(true);
    } catch {
      setErreur("Erreur réseau — réessayez dans un instant");
    } finally {
      setEnCours(false);
    }
  }

  if (envoye) {
    return (
      <div className="rounded-marque border border-marine-100 bg-white p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Demande envoyée</p>
        <h2 className="mt-2 text-xl font-extrabold text-marine-500">Merci !</h2>
        <p className="mt-2 text-marine-400">Notre équipe étudie votre besoin et vous recontacte rapidement.</p>
      </div>
    );
  }

  return (
    <form onSubmit={soumettre} className="space-y-4 rounded-marque border border-marine-100 bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-bold text-marine-500">Nom complet</label>
          <input
            required
            value={champs.nomContact}
            onChange={majChamp("nomContact")}
            className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-marine-500">E-mail</label>
          <input
            type="email"
            required
            value={champs.emailContact}
            onChange={majChamp("emailContact")}
            className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-marine-500">Téléphone (optionnel)</label>
        <input
          value={champs.telContact}
          onChange={majChamp("telContact")}
          placeholder="+509 ..."
          className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-marine-500">Décrivez votre besoin</label>
        <textarea
          required
          rows={6}
          value={champs.description}
          onChange={majChamp("description")}
          placeholder="Ce que vous voulez faire imprimer ou concevoir, les quantités, le délai souhaité…"
          className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
        />
      </div>

      {erreur && <p className="text-sm text-magenta-600">{erreur}</p>}

      <Bouton taille="normal" className="w-full sm:w-auto" disabled={enCours}>
        {enCours ? "Envoi…" : "Envoyer ma demande"}
      </Bouton>
    </form>
  );
}
