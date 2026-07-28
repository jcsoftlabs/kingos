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

  const devisActif = devis.find((d) => d.statut === "ENVOYE" || d.statut === "BROUILLON");
  const devisAccepte = devis.find((d) => d.statut === "ACCEPTE");
  const factureExiste = factures.length > 0;

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
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(null);
    }
  }

  return (
    <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-marine-500">Actions</h2>
      {erreur && <p className="mt-2 text-sm text-magenta-600">{erreur}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
