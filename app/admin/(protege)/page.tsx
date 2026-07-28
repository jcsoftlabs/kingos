import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";

export const metadata = { title: "Tableau de bord — Admin" };

interface TableauDeBord {
  commandesParStatut: { statut: string; total: number }[];
  devisEnAttente: number;
  facturesImpayees: number;
  caDuMoisCents: string | null;
}

const LIBELLES_STATUT: Record<string, string> = {
  BROUILLON: "Brouillon",
  DEVIS_DEMANDE: "Devis demandé",
  DEVIS_ENVOYE: "Devis envoyé",
  DEVIS_ACCEPTE: "Devis accepté",
  DEVIS_REFUSE: "Devis refusé",
  EN_ATTENTE_PAIEMENT: "En attente de paiement",
  PAYEE: "Payée",
  FICHIERS_A_VERIFIER: "Fichiers à vérifier",
  BAT_EN_ATTENTE: "BAT en attente",
  BAT_VALIDE: "BAT validé",
  EN_PRODUCTION: "En production",
  PRETE: "Prête",
  LIVREE: "Livrée",
  CLOTUREE: "Clôturée",
  ANNULEE: "Annulée",
};

export default async function PageTableauDeBord() {
  const { corps } = await apiBackendAuthentifie<TableauDeBord>("/api/admin/tableau-de-bord");
  const donnees = corps.succes ? corps.donnees : null;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-marine-500">Tableau de bord</h1>

      {!donnees && <p className="mt-4 text-marine-400">Impossible de charger le tableau de bord.</p>}

      {donnees && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-marque border border-marine-100 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-marine-400">CA du mois</p>
              <p className="mt-2 text-2xl font-extrabold text-marine-500">
                {donnees.caDuMoisCents !== null ? formaterHTG(donnees.caDuMoisCents) : "—"}
              </p>
            </div>
            <div className="rounded-marque border border-marine-100 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-marine-400">Devis en attente</p>
              <p className="mt-2 text-2xl font-extrabold text-marine-500">{donnees.devisEnAttente}</p>
            </div>
            <div className="rounded-marque border border-marine-100 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-marine-400">Factures impayées</p>
              <p className="mt-2 text-2xl font-extrabold text-magenta-600">{donnees.facturesImpayees}</p>
            </div>
          </div>

          <div className="mt-8 rounded-marque border border-marine-100 bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-marine-400">Commandes par statut</h2>
            {donnees.commandesParStatut.length === 0 ? (
              <p className="mt-3 text-sm text-marine-400">Aucune commande pour l&apos;instant.</p>
            ) : (
              <ul className="mt-3 divide-y divide-marine-100">
                {donnees.commandesParStatut.map((s) => (
                  <li key={s.statut} className="flex justify-between py-2 text-sm">
                    <span className="text-marine-500">{LIBELLES_STATUT[s.statut] ?? s.statut}</span>
                    <span className="font-bold text-marine-500">{s.total}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
