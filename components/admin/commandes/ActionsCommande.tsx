"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

interface DevisResume {
  id: string;
  numero: string;
  statut: string;
}
interface FactureResume {
  id: string;
  numero: string;
  statut: string;
  payeCents?: string;
}

// Reflet côté UI de commandes/machine-etats.ts — le backend reste la seule
// source de vérité (toute transition hors de cette liste est de toute façon
// refusée côté serveur), ceci ne sert qu'à proposer les bons boutons.
const TRANSITIONS: Record<string, string[]> = {
  PAYEE: ["FICHIERS_A_VERIFIER", "EN_PRODUCTION"],
  FICHIERS_A_VERIFIER: ["BAT_EN_ATTENTE", "EN_PRODUCTION"],
  BAT_EN_ATTENTE: ["BAT_VALIDE"],
  BAT_VALIDE: ["EN_PRODUCTION"],
  EN_PRODUCTION: ["PRETE"],
  PRETE: ["LIVREE"],
  LIVREE: ["CLOTUREE"],
};

const LIBELLES: Record<string, string> = {
  FICHIERS_A_VERIFIER: "Fichiers à vérifier",
  EN_PRODUCTION: "Lancer la production",
  BAT_EN_ATTENTE: "Envoyer le BAT",
  BAT_VALIDE: "Valider le BAT",
  PRETE: "Marquer prête",
  LIVREE: "Marquer livrée",
  CLOTUREE: "Clôturer",
};

// Statuts depuis lesquels le backend autorise → ANNULEE (commandes/machine-etats.ts).
const STATUTS_ANNULABLES = new Set([
  "BROUILLON", "DEVIS_DEMANDE", "DEVIS_ENVOYE", "DEVIS_ACCEPTE", "DEVIS_REFUSE",
  "EN_ATTENTE_PAIEMENT", "PAYEE", "FICHIERS_A_VERIFIER", "BAT_EN_ATTENTE",
]);

function ProchaineEtape({ texte }: { texte: string }) {
  return (
    <p className="mb-3 rounded-marque bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700">
      Étape suivante : {texte}
    </p>
  );
}

export function ActionsCommande({
  commandeId,
  statut,
  devis,
  factures,
  peutAgirCommercial,
}: {
  commandeId: string;
  statut: string;
  devis: DevisResume[];
  factures: FactureResume[];
  peutAgirCommercial: boolean;
}) {
  const router = useRouter();
  const [enCours, setEnCours] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [annulationOuverte, setAnnulationOuverte] = useState<"commande" | "facture" | null>(null);
  const [motif, setMotif] = useState("");

  const devisActif = devis.find((d) => d.statut === "ENVOYE" || d.statut === "BROUILLON");
  const devisAccepte = devis.find((d) => d.statut === "ACCEPTE");
  const factureExiste = factures.length > 0;
  const factureAnnulable = factures.find((f) => f.statut !== "ANNULEE" && f.statut !== "PAYEE" && Number(f.payeCents ?? 0) === 0);

  async function appeler(cle: string, url: string, options: RequestInit = {}) {
    setEnCours(cle);
    setErreur(null);
    try {
      const reponse = await fetch(url, {
        method: options.method ?? "POST",
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Action impossible");
        return;
      }
      setAnnulationOuverte(null);
      setMotif("");
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(null);
    }
  }

  // Texte d'aide contextuel — répond directement à "je ne vois pas où avancer".
  let prochaineEtape: string | null = null;
  if (peutAgirCommercial) {
    if (statut === "BROUILLON") prochaineEtape = "générer le devis pour ce client.";
    else if (devisActif) prochaineEtape = "marquer le devis accepté (ou refusé) une fois la réponse du client connue.";
    else if (devisAccepte && !factureExiste) prochaineEtape = "émettre la facture — le client peut alors payer.";
    else if (factures.some((f) => f.statut === "EMISE" || f.statut === "PARTIELLEMENT_PAYEE")) {
      prochaineEtape = "enregistrer le paiement dès réception (espèces, virement ou chèque) dans la section « Paiement » ci-dessous.";
    } else if (TRANSITIONS[statut]?.length) {
      prochaineEtape = `${LIBELLES[TRANSITIONS[statut][0]]?.toLowerCase()}.`;
    }
  }

  return (
    <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-marine-500">Actions</h2>
      {prochaineEtape && <div className="mt-3"><ProchaineEtape texte={prochaineEtape} /></div>}
      {erreur && <p className="mb-2 text-sm text-magenta-600">{erreur}</p>}

      <div className="flex flex-wrap gap-2">
        {peutAgirCommercial && statut === "BROUILLON" && (
          <Bouton
            taille="petit"
            disabled={enCours !== null}
            onClick={() => appeler("devis", `/api/commandes/${commandeId}/devis`)}
          >
            {enCours === "devis" ? "…" : "Générer le devis"}
          </Bouton>
        )}

        {peutAgirCommercial && devisActif && (
          <>
            <Bouton
              taille="petit"
              disabled={enCours !== null}
              onClick={() => appeler("accepter", `/api/admin/devis/id/${devisActif.id}/accepter`)}
            >
              {enCours === "accepter" ? "…" : "Marquer le devis accepté"}
            </Bouton>
            <Bouton
              taille="petit"
              variante="contour"
              disabled={enCours !== null}
              onClick={() => appeler("refuser", `/api/admin/devis/id/${devisActif.id}/refuser`, { body: "{}" })}
            >
              {enCours === "refuser" ? "…" : "Marquer le devis refusé"}
            </Bouton>
          </>
        )}

        {peutAgirCommercial && devisAccepte && !factureExiste && (
          <Bouton
            taille="petit"
            disabled={enCours !== null}
            onClick={() => appeler("convertir", `/api/admin/devis/id/${devisAccepte.id}/convertir`)}
          >
            {enCours === "convertir" ? "…" : "Émettre la facture"}
          </Bouton>
        )}

        {(TRANSITIONS[statut] ?? []).map((cible) => (
          <Bouton
            key={cible}
            taille="petit"
            variante="contour"
            disabled={enCours !== null}
            onClick={() =>
              appeler(`statut-${cible}`, `/api/admin/commandes/id/${commandeId}/statut`, {
                body: JSON.stringify({ nouveauStatut: cible, message: LIBELLES[cible] }),
              })
            }
          >
            {enCours === `statut-${cible}` ? "…" : LIBELLES[cible]}
          </Bouton>
        ))}

        {!peutAgirCommercial && (
          <p className="text-xs text-marine-400">
            Votre rôle ne permet pas les actions commerciales (devis, facturation) sur cette commande.
          </p>
        )}

        {peutAgirCommercial && STATUTS_ANNULABLES.has(statut) && annulationOuverte !== "commande" && (
          <button
            type="button"
            onClick={() => setAnnulationOuverte("commande")}
            className="rounded-full px-4 py-2 text-xs font-bold text-magenta-600 hover:underline"
          >
            Annuler la commande
          </button>
        )}
        {peutAgirCommercial && factureAnnulable && annulationOuverte !== "facture" && (
          <button
            type="button"
            onClick={() => setAnnulationOuverte("facture")}
            className="rounded-full px-4 py-2 text-xs font-bold text-magenta-600 hover:underline"
          >
            Annuler la facture {factureAnnulable.numero}
          </button>
        )}
      </div>

      {annulationOuverte && (
        <div className="mt-3 rounded-marque border border-magenta-100 bg-magenta-50 p-3">
          <label className="block text-xs font-bold text-marine-500">
            Motif de l&apos;annulation {annulationOuverte === "commande" ? "de la commande" : "de la facture"}
          </label>
          <textarea
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
            placeholder="ex : client s'est rétracté, doublon, erreur de saisie…"
          />
          <div className="mt-2 flex gap-2">
            <Bouton
              taille="petit"
              variante="primaire"
              disabled={!motif.trim() || enCours !== null}
              onClick={() =>
                annulationOuverte === "commande"
                  ? appeler("annuler-commande", `/api/admin/commandes/id/${commandeId}/statut`, {
                      body: JSON.stringify({ nouveauStatut: "ANNULEE", message: motif }),
                    })
                  : appeler("annuler-facture", `/api/admin/factures/id/${factureAnnulable!.id}/annuler`, {
                      body: JSON.stringify({ motif }),
                    })
              }
            >
              {enCours?.startsWith("annuler") ? "…" : "Confirmer l'annulation"}
            </Bouton>
            <button type="button" onClick={() => setAnnulationOuverte(null)} className="text-xs text-marine-400">
              Retour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
