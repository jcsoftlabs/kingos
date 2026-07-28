import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { BoutonPdf } from "@/components/admin/BoutonPdf";
import { EntetePage } from "@/components/admin/EntetePage";
import { BadgeStatut, libelleStatut } from "@/components/admin/BadgeStatut";

export const metadata = { title: "Devis — Admin" };

interface LigneListe {
  id: string;
  numero: string;
  statut: string;
  totalCents?: string;
  expireLe: string;
  creeLe: string;
  commande: { numero: string; nomContact: string; emailContact: string };
}

interface ReponseListe {
  succes: boolean;
  donnees?: LigneListe[];
  meta?: { page: number; total: number; pages: number };
}

const STATUTS = ["BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "EXPIRE"];

export default async function PageDevisAdmin({ searchParams }: { searchParams: Promise<{ statut?: string; page?: string }> }) {
  const params = await searchParams;
  const requete = new URLSearchParams();
  if (params.statut) requete.set("statut", params.statut);
  if (params.page) requete.set("page", params.page);

  const { corps } = await apiBackendAuthentifie<LigneListe[]>(`/api/admin/devis?${requete.toString()}`);
  const reponse = corps as ReponseListe;
  const devis = reponse.succes && reponse.donnees ? reponse.donnees : [];

  return (
    <>
      <EntetePage titre="Devis" description="Devis émis, acceptés ou expirés — avec accès direct au PDF." />

      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/admin/devis"
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
            !params.statut
              ? "bg-marine-500 text-white"
              : "border border-marine-100 bg-white text-marine-400 hover:border-marine-200 hover:text-marine-500"
          }`}
        >
          Tous
        </Link>
        {STATUTS.map((s) => (
          <Link
            key={s}
            href={`/admin/devis?statut=${s}`}
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
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Expire le</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {devis.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-marine-400">
                    Aucun devis{params.statut ? " avec ce statut" : ""}.
                  </td>
                </tr>
              ) : (
                devis.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3 font-bold text-marine-500">{d.numero}</td>
                    <td className="px-5 py-3 text-marine-400">{d.commande.numero}</td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-marine-500">{d.commande.nomContact}</div>
                      <div className="text-xs text-marine-400">{d.commande.emailContact}</div>
                    </td>
                    <td className="px-5 py-3">
                      <BadgeStatut statut={d.statut} />
                    </td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
                      {d.totalCents !== undefined ? formaterHTG(d.totalCents) : "—"}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                      {new Date(d.expireLe).toLocaleDateString("fr-HT")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <BoutonPdf type="devis" numero={d.numero} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {reponse.meta && devis.length > 0 && (
          <div className="border-t border-marine-100 px-5 py-3 text-xs text-marine-400">
            Page {reponse.meta.page} / {reponse.meta.pages || 1} — {reponse.meta.total} devis
          </div>
        )}
      </div>
    </>
  );
}
