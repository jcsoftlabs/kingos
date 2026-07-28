"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

interface LigneVente {
  description: string;
  quantite: number;
  prixUnitaire: string;
}

function ligneVide(): LigneVente {
  return { description: "", quantite: 1, prixUnitaire: "" };
}

export function FormulaireVenteRapide() {
  const router = useRouter();
  const [clientDePassage, setClientDePassage] = useState(true);
  const [nomContact, setNomContact] = useState("");
  const [telContact, setTelContact] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [typeClient, setTypeClient] = useState("PARTICULIER");
  const [entreprise, setEntreprise] = useState("");
  const [lignes, setLignes] = useState<LigneVente[]>([ligneVide()]);
  const [fournisseur, setFournisseur] = useState<"ESPECES" | "VIREMENT" | "CHEQUE">("ESPECES");
  const [numeroCheque, setNumeroCheque] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const total = lignes.reduce((acc, l) => acc + (Number(l.prixUnitaire) || 0) * l.quantite, 0);

  function majLigne(index: number, patch: Partial<LigneVente>) {
    setLignes((l) => l.map((ligne, i) => (i === index ? { ...ligne, ...patch } : ligne)));
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/ventes-rapides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomContact: clientDePassage ? undefined : nomContact,
          telContact: clientDePassage ? undefined : telContact,
          emailContact: emailContact || undefined,
          typeClient: clientDePassage ? "PARTICULIER" : typeClient,
          entreprise: clientDePassage ? undefined : entreprise || undefined,
          lignes: lignes.map((l) => ({
            description: l.description,
            quantite: l.quantite,
            prixUnitaireCents: Math.round(Number(l.prixUnitaire) * 100).toString(),
          })),
          fournisseur,
          ...(fournisseur === "CHEQUE" ? { numeroCheque } : {}),
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Impossible d'enregistrer la vente");
        return;
      }
      router.push(`/admin/factures/${corps.donnees.numero}/recu`);
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-marine-500">Client</h2>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setClientDePassage(true)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              clientDePassage ? "bg-marine-500 text-white" : "border border-marine-100 bg-white text-marine-400"
            }`}
          >
            Client de passage
          </button>
          <button
            type="button"
            onClick={() => setClientDePassage(false)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              !clientDePassage ? "bg-marine-500 text-white" : "border border-marine-100 bg-white text-marine-400"
            }`}
          >
            Client identifié
          </button>
        </div>

        {clientDePassage ? (
          <p className="mt-3 text-xs text-marine-400">
            Travail remis directement sur place — aucune coordonnée requise. Basculez sur « Client identifié » pour
            un client à suivre (entreprise, reçu nominatif, e-mail de confirmation…).
          </p>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-marine-500">Type de client</label>
              <select value={typeClient} onChange={(e) => setTypeClient(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm">
                <option value="PARTICULIER">Particulier</option>
                <option value="ENTREPRISE">Entreprise</option>
                <option value="ONG">ONG</option>
                <option value="INSTITUTION_ETATIQUE">Institution étatique</option>
              </select>
            </div>
            {typeClient !== "PARTICULIER" && (
              <div>
                <label className="block text-xs font-bold text-marine-500">Raison sociale</label>
                <input value={entreprise} onChange={(e) => setEntreprise(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-marine-500">Nom</label>
              <input required value={nomContact} onChange={(e) => setNomContact(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-marine-500">Téléphone</label>
              <input required value={telContact} onChange={(e) => setTelContact(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-marine-500">E-mail (facultatif)</label>
              <input type="email" value={emailContact} onChange={(e) => setEmailContact(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
              <p className="mt-1 text-xs text-marine-400">Si renseigné, la facture et la confirmation de paiement sont envoyées par e-mail.</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-marine-500">Articles</h2>
          <button type="button" onClick={() => setLignes((l) => [...l, ligneVide()])} className="text-xs font-bold text-magenta-500 hover:underline">
            + Ajouter
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {lignes.map((ligne, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-marine-500">Description</label>
                <input
                  required
                  placeholder="ex : Photocopies N&amp;B"
                  value={ligne.description}
                  onChange={(e) => majLigne(i, { description: e.target.value })}
                  className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-marine-500">Qté</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={ligne.quantite}
                  onChange={(e) => majLigne(i, { quantite: Number(e.target.value) })}
                  className="mt-1 w-20 rounded-marque border border-marine-100 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-marine-500">P.U. (HTG)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={ligne.prixUnitaire}
                  onChange={(e) => majLigne(i, { prixUnitaire: e.target.value })}
                  className="mt-1 w-28 rounded-marque border border-marine-100 px-3 py-2 text-sm"
                />
              </div>
              {lignes.length > 1 && (
                <button type="button" onClick={() => setLignes((l) => l.filter((_, idx) => idx !== i))} className="text-xs font-bold text-magenta-600 hover:underline">
                  Retirer
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-right text-lg font-extrabold text-marine-500">
          Total : {total.toLocaleString("fr-HT", { maximumFractionDigits: 2 })} HTG
        </p>
      </div>

      <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-marine-500">Paiement</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-bold text-marine-500">Moyen</label>
            <select value={fournisseur} onChange={(e) => setFournisseur(e.target.value as typeof fournisseur)} className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm">
              <option value="ESPECES">Espèces</option>
              <option value="VIREMENT">Virement</option>
              <option value="CHEQUE">Chèque</option>
            </select>
          </div>
          {fournisseur === "CHEQUE" && (
            <div>
              <label className="block text-xs font-bold text-marine-500">N° de chèque</label>
              <input required value={numeroCheque} onChange={(e) => setNumeroCheque(e.target.value)} className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
      </div>

      {erreur && <p className="text-sm text-magenta-600">{erreur}</p>}

      <Bouton disabled={enCours}>{enCours ? "Enregistrement…" : "Encaisser et imprimer le reçu"}</Bouton>
    </form>
  );
}
