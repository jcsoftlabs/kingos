import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { BoutonPdf } from "@/components/admin/BoutonPdf";
import { EntetePage } from "@/components/admin/EntetePage";
import { BadgeStatut, libelleStatut } from "@/components/admin/BadgeStatut";

export const metadata = { title: "Factures — Admin" };

interface LigneListe {
  id: string;
  numero: string;
  statut: string;
  totalCents?: string;
  payeCents?: string;
  creeLe: string;
  commande: { numero: string; nomContact: string; emailContact: string };
}

interface ReponseListe {
  succes: boolean;
  donnees?: LigneListe[];
  meta?: { page: number; total: number; pages: number };
}

const STATUTS = ["EMISE", "PARTIELLEMENT_PAYEE", "PAYEE", "EN_RETARD", "ANNULEE"];

export default async function PageFacturesAdmin({ searchParams }: { searchParams: Promise<{ statut?: string; page?: string }> }) {
  const params = await searchParams;
  const requete = new URLSearchParams();
  if (params.statut) requete.set("statut", params.statut);
  if (params.page) requete.set("page", params.page);

  const { corps } = await apiBackendAuthentifie<LigneListe[]>(`/api/admin/factures?${requete.toString()}`);
  const reponse = corps as ReponseListe;
  const factures = reponse.succes && reponse.donnees ? reponse.donnees : [];

  return (
    <>
      <EntetePage titre="Factures" description="Suivi des encaissements — PDF et reçu thermique à portée de clic." />

      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/admin/factures"
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
            !params.statut
              ? "bg-marine-500 text-white"
              : "border border-marine-100 bg-white text-marine-400 hover:border-marine-200 hover:text-marine-500"
          }`}
        >
          Toutes
        </Link>
        {STATUTS.map((s) => (
          <Link
            key={s}
            href={`/admin/factures?statut=${s}`}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              params.statut === s
                ? "bg-marine-500 text-white"
                : "border border-marine-100 bg-white text-marine-400 hover:border-marine-200 hover:text-marine-500"
            }`}
          >
            {libelleStatut(s)}
          </Link>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Numéro</th>
                <th className="px-5 py-3">Commande</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Payé / Total</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {factures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-marine-400">
                    Aucune facture{params.statut ? " avec ce statut" : ""}.
                  </td>
                </tr>
              ) : (
                factures.map((f) => (
                  <tr key={f.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3 font-bold text-marine-500">{f.numero}</td>
                    <td className="px-5 py-3 text-marine-400">{f.commande.numero}</td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-marine-500">{f.commande.nomContact}</div>
                      <div className="text-xs text-marine-400">{f.commande.emailContact}</div>
                    </td>
                    <td className="px-5 py-3">
                      <BadgeStatut statut={f.statut} />
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {f.payeCents !== undefined && f.totalCents !== undefined ? (
                        <>
                          <div className="font-bold text-marine-500">{formaterHTG(f.totalCents)}</div>
                          <div className="text-xs text-marine-400">payé {formaterHTG(f.payeCents)}</div>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <BoutonPdf type="factures" numero={f.numero} />
                        <Link
                          href={`/admin/factures/${f.numero}/recu`}
                          className="rounded-marque bg-marine-50 px-2.5 py-1 text-xs font-bold text-marine-500 transition-colors hover:bg-marine-100"
                        >
                          Reçu
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {reponse.meta && factures.length > 0 && (
          <div className="border-t border-marine-100 px-5 py-3 text-xs text-marine-400">
            Page {reponse.meta.page} / {reponse.meta.pages || 1} — {reponse.meta.total} facture(s)
          </div>
        )}
      </div>
    </>
  );
}
