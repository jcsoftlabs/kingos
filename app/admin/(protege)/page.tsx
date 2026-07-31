import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { EntetePage } from "@/components/admin/EntetePage";
import { BadgeStatut, libelleStatut } from "@/components/admin/BadgeStatut";
import { CourbeChiffreAffaires, RepartitionServices } from "@/components/admin/Graphiques";
import { IconeTendance, IconeHorloge, IconeAlerte, IconePanier, IconeUtilisateurs, IconeFacture } from "@/components/icones/admin";

export const metadata = { title: "Tableau de bord — Admin" };

interface TableauDeBord {
  commandesParStatut: { statut: string; total: number }[];
  devisEnAttente: number;
  facturesImpayees: number;
  caDuMoisCents: string | null;
  caMoisPrecedentCents: string | null;
  montantImpayeCents: string | null;
  panierMoyenCents: string | null;
  nouveauxClients30j: number;
  commandes30j: number;
  tauxConversionPct: number | null;
  caParMois: { mois: string; caCents: string | null }[];
  topServices: { serviceNom: string; caCents: string | null; quantite: number; commandes: number }[];
  activiteRecente: {
    id: string;
    type: string;
    message: string | null;
    creeLe: string;
    nouveauStatut: string | null;
    commandeNumero: string | null;
    nomContact: string | null;
  }[];
}

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

function Variation({ courant, precedent }: { courant: string | null; precedent: string | null }) {
  if (courant === null || precedent === null) return null;
  const a = Number(courant);
  const b = Number(precedent);
  if (b === 0) return a === 0 ? null : <span className="text-xs font-bold text-foret-500">nouveau</span>;

  const pct = Math.round(((a - b) / b) * 100);
  if (pct === 0) return <span className="text-xs font-semibold text-marine-300">stable</span>;
  const positif = pct > 0;
  return (
    <span className={`text-xs font-bold ${positif ? "text-foret-500" : "text-magenta-600"}`}>
      {positif ? "▲" : "▼"} {Math.abs(pct)}% <span className="font-medium text-marine-300">vs mois dernier</span>
    </span>
  );
}

function Carte({
  libelle,
  valeur,
  icone,
  ton,
  detail,
}: {
  libelle: string;
  valeur: string | number;
  icone: React.ReactNode;
  ton: "neutre" | "info" | "alerte" | "succes";
  detail?: React.ReactNode;
}) {
  const TONS = {
    neutre: "bg-marine-50 text-marine-500",
    info: "bg-cyan-50 text-cyan-600",
    alerte: "bg-magenta-50 text-magenta-600",
    succes: "bg-foret-50 text-foret-600",
  }[ton];

  return (
    <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">{libelle}</p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${TONS}`}>{icone}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-marine-500">{valeur}</p>
      {detail && <div className="mt-1">{detail}</div>}
    </div>
  );
}

export default async function PageTableauDeBord() {
  const { corps } = await apiBackendAuthentifie<TableauDeBord>("/api/admin/tableau-de-bord");
  const d = corps.succes ? corps.donnees : null;

  if (!d) {
    return (
      <>
        <EntetePage titre="Tableau de bord" />
        <p className="rounded-xl border border-marine-100 bg-white p-6 text-marine-400">
          Impossible de charger le tableau de bord.
        </p>
      </>
    );
  }

  const masque = d.caDuMoisCents === null; // rôle PRODUCTION : aucun montant
  const totalCommandes = d.commandesParStatut.reduce((acc, s) => acc + s.total, 0);

  return (
    <>
      <EntetePage titre="Tableau de bord" description="Vue d'ensemble de l'activité Kingo's." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Carte
          libelle="CA du mois"
          valeur={masque ? "—" : formaterHTG(d.caDuMoisCents!)}
          icone={<IconeTendance className="h-4 w-4" />}
          ton="succes"
          detail={<Variation courant={d.caDuMoisCents} precedent={d.caMoisPrecedentCents} />}
        />
        <Carte
          libelle="Impayé"
          valeur={masque ? "—" : formaterHTG(d.montantImpayeCents!)}
          icone={<IconeAlerte className="h-4 w-4" />}
          ton="alerte"
          detail={<span className="text-xs text-marine-400">{d.facturesImpayees} facture(s) en attente</span>}
        />
        <Carte
          libelle="Commandes (30 j)"
          valeur={d.commandes30j}
          icone={<IconePanier className="h-4 w-4" />}
          ton="info"
          detail={
            <span className="text-xs text-marine-400">
              {masque ? "—" : `panier moyen ${formaterHTG(d.panierMoyenCents!)}`}
            </span>
          }
        />
        <Carte
          libelle="Nouveaux clients (30 j)"
          valeur={d.nouveauxClients30j}
          icone={<IconeUtilisateurs className="h-4 w-4" />}
          ton="neutre"
          detail={
            <span className="text-xs text-marine-400">
              {d.tauxConversionPct !== null ? `${d.tauxConversionPct}% de devis convertis` : "pas encore de devis"}
            </span>
          }
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-marine-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-marine-100 px-5 py-4">
            <h2 className="text-sm font-bold text-marine-500">Chiffre d&apos;affaires — 12 derniers mois</h2>
            <span className="text-xs font-semibold text-marine-400">factures encaissées</span>
          </div>
          <div className="px-4 py-5">
            {masque ? (
              <p className="py-10 text-center text-sm text-marine-400">Montants masqués pour votre rôle.</p>
            ) : (
              <CourbeChiffreAffaires donnees={d.caParMois} />
            )}
          </div>
        </div>

        <div className="rounded-xl border border-marine-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-marine-100 px-5 py-4">
            <h2 className="text-sm font-bold text-marine-500">Services les plus sollicités</h2>
          </div>
          <RepartitionServices services={d.topServices} masque={masque} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-marine-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-marine-100 px-5 py-4">
            <h2 className="text-sm font-bold text-marine-500">Commandes par statut</h2>
            <span className="text-xs font-semibold text-marine-400">{totalCommandes} au total</span>
          </div>
          {d.commandesParStatut.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-marine-400">Aucune commande pour l&apos;instant.</p>
          ) : (
            <ul className="divide-y divide-marine-100">
              {d.commandesParStatut.map((s) => (
                <li key={s.statut} className="flex items-center gap-4 px-5 py-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${TONS_STATUT[s.statut] ?? "bg-cyan-500"}`} />
                  <Link
                    href={`/admin/commandes?statut=${s.statut}`}
                    className="flex-1 text-sm font-medium text-marine-500 hover:text-magenta-500 hover:underline"
                  >
                    {libelleStatut(s.statut)}
                  </Link>
                  <span className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-marine-50 sm:block">
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

        <div className="rounded-xl border border-marine-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-marine-100 px-5 py-4">
            <h2 className="text-sm font-bold text-marine-500">Activité récente</h2>
            <IconeFacture className="h-4 w-4 text-marine-300" />
          </div>
          {d.activiteRecente.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-marine-400">Rien à signaler pour l&apos;instant.</p>
          ) : (
            <ul className="divide-y divide-marine-100">
              {d.activiteRecente.map((e) => (
                <li key={e.id} className="flex items-start gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-marine-500">
                      {e.commandeNumero && (
                        <span className="font-bold">{e.commandeNumero}</span>
                      )}
                      {e.nomContact && <span className="text-marine-400"> — {e.nomContact}</span>}
                    </p>
                    <p className="truncate text-xs text-marine-400">{e.message ?? e.type}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {e.nouveauStatut && <BadgeStatut statut={e.nouveauStatut} />}
                    <p className="mt-1 text-[11px] text-marine-300">
                      {new Date(e.creeLe).toLocaleDateString("fr-HT", { day: "2-digit", month: "short", timeZone: "America/Port-au-Prince" })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
