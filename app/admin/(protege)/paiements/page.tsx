import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { EntetePage } from "@/components/admin/EntetePage";
import { ActionsCheque } from "@/components/admin/paiements/ActionsCheque";

export const metadata = { title: "Chèques en attente — Admin" };

interface ChequeEnAttente {
  id: string;
  montantCents?: string;
  numeroCheque: string | null;
  banqueEmettrice: string | null;
  dateEncaissementPrevue: string | null;
  creeLe: string;
  commande: { numero: string; nomContact: string; entreprise: string | null };
  facture: { numero: string } | null;
}

export default async function PageChequesEnAttente() {
  const { corps } = await apiBackendAuthentifie<ChequeEnAttente[]>("/api/admin/paiements/cheques-en-attente");
  const cheques = corps.succes && corps.donnees ? corps.donnees : [];

  return (
    <>
      <EntetePage
        titre="Chèques en attente"
        description="Un chèque ne compte pas comme payé tant qu'il n'est pas encaissé — c'est ici qu'on le confirme ou le rejette."
      />

      <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Commande</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">N° chèque</th>
                <th className="px-5 py-3">Banque</th>
                <th className="px-5 py-3 text-right">Montant</th>
                <th className="px-5 py-3">Reçu le</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {cheques.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-marine-400">
                    Aucun chèque en attente d&apos;encaissement.
                  </td>
                </tr>
              ) : (
                cheques.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3 font-bold text-marine-500">
                      <Link href={`/admin/commandes/${c.commande.numero}`} className="hover:text-magenta-500 hover:underline">
                        {c.commande.numero}
                      </Link>
                      {c.facture && <div className="text-xs font-normal text-marine-400">{c.facture.numero}</div>}
                    </td>
                    <td className="px-5 py-3 text-marine-500">{c.commande.entreprise || c.commande.nomContact}</td>
                    <td className="px-5 py-3 text-marine-400">{c.numeroCheque}</td>
                    <td className="px-5 py-3 text-marine-400">{c.banqueEmettrice || "—"}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
                      {c.montantCents !== undefined ? formaterHTG(c.montantCents) : "—"}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                      {new Date(c.creeLe).toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" })}
                    </td>
                    <td className="px-5 py-3">
                      <ActionsCheque paiementId={c.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
