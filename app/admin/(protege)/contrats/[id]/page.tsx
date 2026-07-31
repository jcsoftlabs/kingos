import Link from "next/link";
import { notFound } from "next/navigation";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { EntetePage } from "@/components/admin/EntetePage";
import { BadgeStatut } from "@/components/admin/BadgeStatut";
import { BoutonStatutContrat } from "@/components/admin/contrats/BoutonStatutContrat";

interface CommandeResume {
  id: string;
  numero: string;
  statut: string;
  totalCents: string;
  creeLe: string;
}

interface Contrat {
  id: string;
  numero: string;
  emailClient: string;
  nomClient: string;
  entreprise: string | null;
  objet: string;
  dateDebut: string;
  dateFin: string | null;
  statut: string;
  remisePct: string | null;
  delaiPaiementJours: number | null;
  notes: string | null;
  commandes: CommandeResume[];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { corps } = await apiBackendAuthentifie<Contrat>(`/api/admin/contrats/${id}`);
  return { title: `${corps.donnees?.numero ?? "Contrat"} — Admin` };
}

export default async function PageContratAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { corps } = await apiBackendAuthentifie<Contrat>(`/api/admin/contrats/${id}`);
  if (!corps.succes || !corps.donnees) notFound();
  const contrat = corps.donnees;

  return (
    <>
      <Link href="/admin/contrats" className="text-xs font-bold text-marine-400 hover:text-magenta-500">
        ← Tous les contrats
      </Link>

      <EntetePage titre={contrat.numero} description={contrat.objet}>
        <BoutonStatutContrat contratId={contrat.id} statut={contrat.statut} />
      </EntetePage>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-marine-500">Client</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-xs text-marine-400">Nom</dt>
              <dd className="font-medium text-marine-500">{contrat.entreprise || contrat.nomClient}</dd>
            </div>
            {contrat.entreprise && (
              <div>
                <dt className="text-xs text-marine-400">Contact</dt>
                <dd className="font-medium text-marine-500">{contrat.nomClient}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-marine-400">E-mail</dt>
              <dd className="font-medium text-marine-500">{contrat.emailClient}</dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <div className="rounded-xl border border-marine-100 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">Période</p>
            <p className="mt-1.5 text-sm font-bold text-marine-500">
              {new Date(contrat.dateDebut).toLocaleDateString("fr-HT", { timeZone: "UTC" })}
              {" — "}
              {contrat.dateFin ? new Date(contrat.dateFin).toLocaleDateString("fr-HT", { timeZone: "UTC" }) : "indéterminée"}
            </p>
          </div>
          <div className="rounded-xl border border-marine-100 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">Remise convenue</p>
            <p className="mt-1.5 text-sm font-bold text-marine-500">{contrat.remisePct ? `${contrat.remisePct}%` : "—"}</p>
          </div>
          <div className="rounded-xl border border-marine-100 bg-white p-4 shadow-sm sm:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">Délai de paiement</p>
            <p className="mt-1.5 text-sm font-bold text-marine-500">
              {contrat.delaiPaiementJours ? `${contrat.delaiPaiementJours} jours` : "—"}
            </p>
          </div>
          {contrat.notes && (
            <div className="rounded-xl border border-marine-100 bg-white p-4 shadow-sm sm:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">Notes</p>
              <p className="mt-1.5 text-sm text-marine-500">{contrat.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="border-b border-marine-100 px-5 py-4">
          <h2 className="text-sm font-bold text-marine-500">Commandes sous ce contrat ({contrat.commandes.length})</h2>
        </div>
        {contrat.commandes.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-marine-400">Aucune commande rattachée pour l&apos;instant.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-marine-100">
              {contrat.commandes.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-creme-100">
                  <td className="px-5 py-3">
                    <Link href={`/admin/commandes/${c.numero}`} className="font-bold text-marine-500 hover:text-magenta-500 hover:underline">
                      {c.numero}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <BadgeStatut statut={c.statut} />
                  </td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">{formaterHTG(c.totalCents)}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                    {new Date(c.creeLe).toLocaleDateString("fr-HT")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
