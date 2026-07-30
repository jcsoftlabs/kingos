"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

const LIBELLES_TYPE_CLIENT: Record<string, string> = {
  PARTICULIER: "Particulier",
  ENTREPRISE: "Entreprise",
  ONG: "ONG",
  INSTITUTION_ETATIQUE: "Institution étatique",
};

const VALEURS_INITIALES = { email: "", nomContact: "", entreprise: "", typeClient: "PARTICULIER", telContact: "", adresseLivraison: "" };

export function FormulaireNouveauClient() {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [valeurs, setValeurs] = useState(VALEURS_INITIALES);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function creer(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: valeurs.email,
          nomContact: valeurs.nomContact,
          entreprise: valeurs.entreprise || null,
          typeClient: valeurs.typeClient,
          telContact: valeurs.telContact,
          adresseLivraison: valeurs.adresseLivraison || null,
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Création impossible");
        return;
      }
      setValeurs(VALEURS_INITIALES);
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
      <Bouton taille="petit" variante="secondaire" onClick={() => setOuvert(true)}>
        Nouveau client
      </Bouton>
    );
  }

  return (
    <form onSubmit={creer} className="mb-5 rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-marine-500">Nouveau client (sans commande)</h2>
      <p className="mt-1 text-xs text-marine-400">
        Pour entrer un client déjà connu de l&apos;entreprise, sans passer par une commande. Pour une liste entière,
        utilisez plutôt l&apos;import CSV ci-dessous.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-marine-500">E-mail</label>
          <input
            required
            type="email"
            value={valeurs.email}
            onChange={(e) => setValeurs((v) => ({ ...v, email: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Type de client</label>
          <select
            value={valeurs.typeClient}
            onChange={(e) => setValeurs((v) => ({ ...v, typeClient: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          >
            {Object.entries(LIBELLES_TYPE_CLIENT).map(([valeur, libelle]) => (
              <option key={valeur} value={valeur}>
                {libelle}
              </option>
            ))}
          </select>
        </div>
        {valeurs.typeClient !== "PARTICULIER" && (
          <div>
            <label className="block text-xs font-bold text-marine-500">Raison sociale</label>
            <input
              value={valeurs.entreprise}
              onChange={(e) => setValeurs((v) => ({ ...v, entreprise: e.target.value }))}
              className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-bold text-marine-500">Nom du contact</label>
          <input
            required
            value={valeurs.nomContact}
            onChange={(e) => setValeurs((v) => ({ ...v, nomContact: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Téléphone</label>
          <input
            required
            value={valeurs.telContact}
            onChange={(e) => setValeurs((v) => ({ ...v, telContact: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-marine-500">Adresse de livraison</label>
          <input
            value={valeurs.adresseLivraison}
            onChange={(e) => setValeurs((v) => ({ ...v, adresseLivraison: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {erreur && <p className="mt-2 text-sm text-magenta-600">{erreur}</p>}

      <div className="mt-4 flex gap-2">
        <Bouton taille="petit" disabled={enCours}>
          {enCours ? "…" : "Créer le client"}
        </Bouton>
        <button
          type="button"
          onClick={() => {
            setOuvert(false);
            setErreur(null);
          }}
          className="text-xs text-marine-400"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
