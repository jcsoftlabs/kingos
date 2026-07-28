"use client";

import { useState } from "react";
import { Bouton } from "@/components/Bouton";

export function FormulaireContact() {
  const [champs, setChamps] = useState({ nom: "", email: "", telephone: "", sujet: "", message: "" });
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
      const reponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(champs),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Impossible d'envoyer le message");
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
        <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Message envoyé</p>
        <h2 className="mt-2 text-xl font-extrabold text-marine-500">Merci de nous avoir contactés</h2>
        <p className="mt-2 text-marine-400">Notre équipe vous répond dans les meilleurs délais.</p>
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
            value={champs.nom}
            onChange={majChamp("nom")}
            className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-marine-500">E-mail</label>
          <input
            type="email"
            required
            value={champs.email}
            onChange={majChamp("email")}
            className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-marine-500">Téléphone (optionnel)</label>
        <input
          value={champs.telephone}
          onChange={majChamp("telephone")}
          placeholder="+509 ..."
          className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-marine-500">Sujet</label>
        <input
          required
          value={champs.sujet}
          onChange={majChamp("sujet")}
          className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-marine-500">Message</label>
        <textarea
          required
          rows={5}
          value={champs.message}
          onChange={majChamp("message")}
          className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
        />
      </div>

      {erreur && <p className="text-sm text-magenta-600">{erreur}</p>}

      <Bouton taille="normal" className="w-full sm:w-auto" disabled={enCours}>
        {enCours ? "Envoi…" : "Envoyer le message"}
      </Bouton>
    </form>
  );
}
