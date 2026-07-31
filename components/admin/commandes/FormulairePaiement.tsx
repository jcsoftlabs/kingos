"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";
import { formaterHTG } from "@/lib/types-catalogue";

export function FormulairePaiement({
  factureId,
  soldeRestantCents,
  tauxChangeUSD,
}: {
  factureId: string;
  soldeRestantCents: string;
  tauxChangeUSD: number | null;
}) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [fournisseur, setFournisseur] = useState<"ESPECES" | "VIREMENT" | "CHEQUE">("ESPECES");
  const [devise, setDevise] = useState<"HTG" | "USD">("HTG");
  const [montant, setMontant] = useState(() => (Number(soldeRestantCents) / 100).toString());
  const [numeroCheque, setNumeroCheque] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const soldeGourdes = Number(soldeRestantCents) / 100;

  // La facture reste libellée en gourdes : un paiement en dollars est converti
  // au taux configuré, et c'est l'équivalent qui solde la facture.
  function basculerDevise(nouvelle: "HTG" | "USD") {
    if (nouvelle === devise || !tauxChangeUSD) return;
    setDevise(nouvelle);
    setMontant(nouvelle === "USD" ? (soldeGourdes / tauxChangeUSD).toFixed(2) : soldeGourdes.toString());
  }

  const equivalentGourdes = devise === "USD" && tauxChangeUSD ? Number(montant || 0) * tauxChangeUSD : null;

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/admin/paiements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          factureId,
          fournisseur,
          montantCents: Math.round(Number(montant) * 100).toString(),
          deviseEncaissement: devise,
          ...(fournisseur === "CHEQUE" ? { numeroCheque } : {}),
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Enregistrement impossible");
        return;
      }
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
      <Bouton taille="petit" onClick={() => setOuvert(true)}>
        Enregistrer un paiement
      </Bouton>
    );
  }

  return (
    <form onSubmit={soumettre} className="rounded-marque border border-marine-100 bg-creme-100 p-4">
      <p className="text-xs text-marine-400">Solde restant : {formaterHTG(soldeRestantCents)}</p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-bold text-marine-500">Moyen</label>
          <select
            value={fournisseur}
            onChange={(e) => setFournisseur(e.target.value as typeof fournisseur)}
            className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm"
          >
            <option value="ESPECES">Espèces</option>
            <option value="VIREMENT">Virement</option>
            <option value="CHEQUE">Chèque</option>
          </select>
        </div>
        {tauxChangeUSD && (
          <div>
            <label className="block text-xs font-bold text-marine-500">Réglé en</label>
            <div className="mt-1 flex overflow-hidden rounded-marque border border-marine-100">
              {(["HTG", "USD"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => basculerDevise(d)}
                  className={`px-3 py-2 text-sm font-bold transition-colors ${
                    devise === d ? "bg-marine-500 text-white" : "bg-white text-marine-400 hover:bg-creme-100"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block text-xs font-bold text-marine-500">Montant ({devise})</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="mt-1 w-32 rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
          {equivalentGourdes !== null && (
            <p className="mt-1 text-[11px] text-marine-400">
              = {formaterHTG(Math.round(equivalentGourdes * 100))} au taux de {tauxChangeUSD}
            </p>
          )}
        </div>
        {fournisseur === "CHEQUE" && (
          <div>
            <label className="block text-xs font-bold text-marine-500">N° de chèque</label>
            <input
              required
              value={numeroCheque}
              onChange={(e) => setNumeroCheque(e.target.value)}
              className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm"
            />
          </div>
        )}
        {erreur && <p className="text-xs text-magenta-600">{erreur}</p>}
        <Bouton taille="petit" disabled={enCours}>
          {enCours ? "…" : "Confirmer"}
        </Bouton>
        <button type="button" onClick={() => setOuvert(false)} className="text-xs text-marine-400">
          Annuler
        </button>
      </div>
    </form>
  );
}
