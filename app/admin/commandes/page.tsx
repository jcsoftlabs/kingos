import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";

export const metadata = { title: "Commandes — Admin" };

interface LigneListe {
  id: string;
  numero: string;
  statut: string;
  nomContact: string;
  emailContact: string;
  totalCents?: string;
  creeLe: string;
  lignes: { serviceNom: string; quantite: number }[];
}

interface ReponseListe {
  succes: boolean;
  donnees?: LigneListe[];
  meta?: { page: number; total: number; pages: number };
}

const STATUTS = [
  "BROUILLON", "DEVIS_DEMANDE", "DEVIS_ENVOYE", "DEVIS_ACCEPTE", "DEVIS_REFUSE",
  "EN_ATTENTE_PAIEMENT", "PAYEE", "EN_PRODUCTION", "PRETE", "LIVREE", "CLOTUREE", "ANNULEE",
];

export default async function PageCommandesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; page?: string }>;
}) {
  const params = await searchParams;
  const requete = new URLSearchParams();
  if (params.statut) requete.set("statut", params.statut);
  if (params.page) requete.set("page", params.page);

  const { corps } = await apiBackendAuthentifie<LigneListe[]>(`/api/admin/commandes?${requete.toString()}`);
  const reponse = corps as ReponseListe;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-marine-500">Commandes</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/commandes"
          className={`rounded-marque px-3 py-1.5 text-xs font-bold ${!params.statut ? "bg-marine-500 text-white" : "bg-white text-marine-500 border border-marine-100"}`}
        >
          Tous
        </Link>
        {STATUTS.map((s) => (
          <Link
            key={s}
            href={`/admin/commandes?statut=${s}`}
            className={`rounded-marque px-3 py-1.5 text-xs font-bold ${params.statut === s ? "bg-marine-500 text-white" : "bg-white text-marine-500 border border-marine-100"}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-marque border border-marine-100 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-marine-100 bg-creme-200 text-left text-xs font-bold uppercase tracking-wide text-marine-400">
            <tr>
              <th className="px-4 py-3">Numéro</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marine-100">
            {!reponse.succes || !reponse.donnees || reponse.donnees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-marine-400">
                  Aucune commande.
                </td>
              </tr>
            ) : (
              reponse.donnees.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-bold text-marine-500">{c.numero}</td>
                  <td className="px-4 py-3 text-marine-500">
                    {c.nomContact}
                    <div className="text-xs text-marine-400">{c.emailContact}</div>
                  </td>
                  <td className="px-4 py-3 text-marine-400">{c.lignes[0]?.serviceNom ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-marque bg-creme-200 px-2 py-1 text-xs font-bold text-marine-500">{c.statut}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-marine-500">
                    {c.totalCents !== undefined ? formaterHTG(c.totalCents) : "—"}
                  </td>
                  <td className="px-4 py-3 text-marine-400">{new Date(c.creeLe).toLocaleDateString("fr-HT")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {reponse.meta && (
        <p className="mt-4 text-xs text-marine-400">
          Page {reponse.meta.page} / {reponse.meta.pages || 1} — {reponse.meta.total} commande(s)
        </p>
      )}
    </div>
  );
}
