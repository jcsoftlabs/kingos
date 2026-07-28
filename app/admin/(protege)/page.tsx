import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { EntetePage } from "@/components/admin/EntetePage";
import { IconeTendance, IconeHorloge, IconeAlerte } from "@/components/icones/admin";

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

// Chaque statut porte sa couleur de la charte : vert = encaissé/terminé,
// magenta = action commerciale attendue, cyan = en cours d'exécution.
const TONS_STATUT: Record<string, string> = {
  PAYEE: "bg-foret-500",
  LIVREE: "bg-foret-500",
  CLOTUREE: "bg-foret-400",
  DEVIS_DEMANDE: "bg-magenta-500",
  DEVIS_ENVOYE: "bg-magenta-400",
  EN_ATTENTE_PAIEMENT: "bg-magenta-500",
  ANNULEE: "bg-marine-200",
  DEVIS_REFUSE: "bg-marine-200",
};

function Statistique({
  libelle,
  valeur,
  icone,
  ton,
}: {
  libelle: string;
  valeur: string | number;
  icone: React.ReactNode;
  ton: "neutre" | "attention" | "alerte";
}) {
  const TONS = {
    neutre: { tuile: "bg-marine-50 text-marine-500", valeur: "text-marine-500" },
    attention: { tuile: "bg-cyan-50 text-cyan-600", valeur: "text-marine-500" },
    alerte: { tuile: "bg-magenta-50 text-magenta-600", valeur: "text-magenta-600" },
  }[ton];

  return (
    <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-marine-400">{libelle}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONS.tuile}`}>{icone}</span>
      </div>
      <p className={`mt-3 text-2xl font-extrabold tracking-tight ${TONS.valeur}`}>{valeur}</p>
    </div>
  );
}

export default async function PageTableauDeBord() {
  const { corps } = await apiBackendAuthentifie<TableauDeBord>("/api/admin/tableau-de-bord");
  const donnees = corps.succes ? corps.donnees : null;

  if (!donnees) {
    return (
      <>
        <EntetePage titre="Tableau de bord" />
        <p className="rounded-xl border border-marine-100 bg-white p-6 text-marine-400">
          Impossible de charger le tableau de bord.
        </p>
      </>
    );
  }

  const totalCommandes = donnees.commandesParStatut.reduce((acc, s) => acc + s.total, 0);

  return (
    <>
      <EntetePage titre="Tableau de bord" description="Vue d'ensemble de l'activité Kingo's." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Statistique
          libelle="CA du mois"
          valeur={donnees.caDuMoisCents !== null ? formaterHTG(donnees.caDuMoisCents) : "—"}
          icone={<IconeTendance className="h-4 w-4" />}
          ton="neutre"
        />
        <Statistique
          libelle="Devis en attente"
          valeur={donnees.devisEnAttente}
          icone={<IconeHorloge className="h-4 w-4" />}
          ton="attention"
        />
        <Statistique
          libelle="Factures impayées"
          valeur={donnees.facturesImpayees}
          icone={<IconeAlerte className="h-4 w-4" />}
          ton="alerte"
        />
      </div>

      <div className="mt-6 rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-marine-100 px-5 py-4">
          <h2 className="text-sm font-bold text-marine-500">Commandes par statut</h2>
          <span className="text-xs font-semibold text-marine-400">{totalCommandes} au total</span>
        </div>

        {donnees.commandesParStatut.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-marine-400">Aucune commande pour l&apos;instant.</p>
        ) : (
          <ul className="divide-y divide-marine-100">
            {donnees.commandesParStatut.map((s) => (
              <li key={s.statut} className="flex items-center gap-4 px-5 py-3">
                <span className={`h-2 w-2 shrink-0 rounded-full ${TONS_STATUT[s.statut] ?? "bg-cyan-500"}`} />
                <span className="flex-1 text-sm font-medium text-marine-500">
                  {LIBELLES_STATUT[s.statut] ?? s.statut}
                </span>
                {/* Barre proportionnelle : lit d'un coup d'œil où s'accumulent les commandes. */}
                <span className="hidden h-1.5 w-40 overflow-hidden rounded-full bg-marine-50 sm:block">
                  <span
                    className={`block h-full rounded-full ${TONS_STATUT[s.statut] ?? "bg-cyan-500"}`}
                    style={{ width: `${totalCommandes ? (s.total / totalCommandes) * 100 : 0}%` }}
                  />
                </span>
                <span className="w-8 text-right text-sm font-bold tabular-nums text-marine-500">{s.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
