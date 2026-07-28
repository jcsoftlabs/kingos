// Libellés et tons partagés par les écrans commandes / devis / factures :
// afficher les valeurs brutes de la base ("DEVIS_DEMANDE") dans l'interface
// était l'un des points qui faisaient « brouillon » côté back-office.

type Ton = "neutre" | "info" | "attention" | "succes" | "danger";

const TONS: Record<Ton, string> = {
  neutre: "bg-marine-50 text-marine-400 ring-marine-100",
  info: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  attention: "bg-lime-50 text-marine-500 ring-lime-200",
  succes: "bg-foret-50 text-foret-600 ring-foret-100",
  danger: "bg-magenta-50 text-magenta-600 ring-magenta-100",
};

const STATUTS: Record<string, { libelle: string; ton: Ton }> = {
  // Commandes
  BROUILLON: { libelle: "Brouillon", ton: "neutre" },
  DEVIS_DEMANDE: { libelle: "Devis demandé", ton: "attention" },
  DEVIS_ENVOYE: { libelle: "Devis envoyé", ton: "info" },
  DEVIS_ACCEPTE: { libelle: "Devis accepté", ton: "succes" },
  DEVIS_REFUSE: { libelle: "Devis refusé", ton: "danger" },
  EN_ATTENTE_PAIEMENT: { libelle: "Attente paiement", ton: "attention" },
  FICHIERS_A_VERIFIER: { libelle: "Fichiers à vérifier", ton: "attention" },
  BAT_EN_ATTENTE: { libelle: "BAT en attente", ton: "attention" },
  BAT_VALIDE: { libelle: "BAT validé", ton: "info" },
  EN_PRODUCTION: { libelle: "En production", ton: "info" },
  PRETE: { libelle: "Prête", ton: "info" },
  LIVREE: { libelle: "Livrée", ton: "succes" },
  CLOTUREE: { libelle: "Clôturée", ton: "succes" },
  ANNULEE: { libelle: "Annulée", ton: "neutre" },
  // Devis
  ENVOYE: { libelle: "Envoyé", ton: "info" },
  ACCEPTE: { libelle: "Accepté", ton: "succes" },
  REFUSE: { libelle: "Refusé", ton: "danger" },
  EXPIRE: { libelle: "Expiré", ton: "neutre" },
  // Factures
  EMISE: { libelle: "Émise", ton: "info" },
  PARTIELLEMENT_PAYEE: { libelle: "Partiellement payée", ton: "attention" },
  PAYEE: { libelle: "Payée", ton: "succes" },
  EN_RETARD: { libelle: "En retard", ton: "danger" },
};

export function libelleStatut(statut: string) {
  return STATUTS[statut]?.libelle ?? statut;
}

export function BadgeStatut({ statut }: { statut: string }) {
  const info = STATUTS[statut] ?? { libelle: statut, ton: "neutre" as Ton };
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${TONS[info.ton]}`}
    >
      {info.libelle}
    </span>
  );
}
