"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";
import { RechercheClient } from "@/components/admin/commandes/RechercheClient";

const VALEURS_INITIALES = {
  emailClient: "",
  nomClient: "",
  entreprise: "",
  objet: "",
  dateDebut: new Date().toISOString().slice(0, 10),
  dateFin: "",
  remisePct: "",
  delaiPaiementJours: "",
  notes: "",
};

export function FormulaireNouveauContrat() {
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
      const reponse = await fetch("/api/admin/contrats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailClient: valeurs.emailClient,
          nomClient: valeurs.nomClient,
          entreprise: valeurs.entreprise || null,
          objet: valeurs.objet,
          dateDebut: valeurs.dateDebut,
          dateFin: valeurs.dateFin || null,
          remisePct: valeurs.remisePct ? Number(valeurs.remisePct) : null,
          delaiPaiementJours: valeurs.delaiPaiementJours ? Number(valeurs.delaiPaiementJours) : null,
          notes: valeurs.notes || null,
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Création impossible");
        return;
      }
      router.push(`/admin/contrats/${corps.donnees.id}`);
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  if (!ouvert) {
    return (
      <Bouton taille="petit" variante="secondaire" onClick={() => setOuvert(true)}>
        Nouveau contrat
      </Bouton>
    );
  }

  return (
    <form onSubmit={creer} className="mb-5 rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-marine-500">Nouveau contrat</h2>

      <div className="mt-3">
        <RechercheClient
          onSelectionner={(client) =>
            setValeurs((v) => ({ ...v, emailClient: client.email, nomClient: client.nom, entreprise: client.entreprise ?? "" }))
          }
        />
      </div>

      <div className="mt-4 grid gap-3 border-t border-marine-100 pt-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-marine-500">E-mail du client</label>
          <input
            required
            type="email"
            value={valeurs.emailClient}
            onChange={(e) => setValeurs((v) => ({ ...v, emailClient: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Nom du contact</label>
          <input
            required
            value={valeurs.nomClient}
            onChange={(e) => setValeurs((v) => ({ ...v, nomClient: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-marine-500">Entreprise / institution (optionnel)</label>
          <input
            value={valeurs.entreprise}
            onChange={(e) => setValeurs((v) => ({ ...v, entreprise: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-marine-500">Objet du contrat</label>
          <input
            required
            value={valeurs.objet}
            onChange={(e) => setValeurs((v) => ({ ...v, objet: e.target.value }))}
            placeholder="Impression mensuelle de supports pédagogiques…"
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Date de début</label>
          <input
            required
            type="date"
            value={valeurs.dateDebut}
            onChange={(e) => setValeurs((v) => ({ ...v, dateDebut: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Date de fin (optionnel)</label>
          <input
            type="date"
            value={valeurs.dateFin}
            onChange={(e) => setValeurs((v) => ({ ...v, dateFin: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Remise convenue (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step="any"
            value={valeurs.remisePct}
            onChange={(e) => setValeurs((v) => ({ ...v, remisePct: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Délai de paiement (jours)</label>
          <input
            type="number"
            min={1}
            value={valeurs.delaiPaiementJours}
            onChange={(e) => setValeurs((v) => ({ ...v, delaiPaiementJours: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-marine-500">Notes (optionnel)</label>
          <textarea
            rows={2}
            value={valeurs.notes}
            onChange={(e) => setValeurs((v) => ({ ...v, notes: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {erreur && <p className="mt-2 text-sm text-magenta-600">{erreur}</p>}

      <div className="mt-4 flex gap-2">
        <Bouton taille="petit" disabled={enCours}>
          {enCours ? "…" : "Créer le contrat"}
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
