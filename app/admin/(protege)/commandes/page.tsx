import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { EntetePage } from "@/components/admin/EntetePage";
import { BadgeStatut, libelleStatut } from "@/components/admin/BadgeStatut";
import { Bouton } from "@/components/Bouton";

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
  "DEVIS_DEMANDE", "DEVIS_ENVOYE", "DEVIS_ACCEPTE", "EN_ATTENTE_PAIEMENT",
  "PAYEE", "EN_PRODUCTION", "PRETE", "LIVREE", "CLOTUREE", "ANNULEE",
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
  const commandes = reponse.succes && reponse.donnees ? reponse.donnees : [];

  return (
    <>
      <EntetePage titre="Commandes" description="Toutes les commandes, du devis demandé à la clôture.">
        <div className="flex gap-2">
          <Bouton taille="petit" variante="contour" href="/admin/ventes-rapides">
            Vente rapide
          </Bouton>
          <Bouton taille="petit" href="/admin/commandes/nouvelle">
            Nouvelle commande
          </Bouton>
        </div>
      </EntetePage>

      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/admin/commandes"
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
            href={`/admin/commandes?statut=${s}`}
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
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {commandes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-marine-400">
                    Aucune commande{params.statut ? " avec ce statut" : ""}.
                  </td>
                </tr>
              ) : (
                commandes.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3 font-bold text-marine-500">
                      <Link href={`/admin/commandes/${c.numero}`} className="hover:text-magenta-500 hover:underline">
                        {c.numero}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-marine-500">{c.nomContact}</div>
                      <div className="text-xs text-marine-400">{c.emailContact}</div>
                    </td>
                    <td className="px-5 py-3 text-marine-400">{c.lignes[0]?.serviceNom ?? "—"}</td>
                    <td className="px-5 py-3">
                      <BadgeStatut statut={c.statut} />
                    </td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
                      {c.totalCents !== undefined ? formaterHTG(c.totalCents) : "—"}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                      {new Date(c.creeLe).toLocaleDateString("fr-HT")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {reponse.meta && commandes.length > 0 && (
          <div className="border-t border-marine-100 px-5 py-3 text-xs text-marine-400">
            Page {reponse.meta.page} / {reponse.meta.pages || 1} — {reponse.meta.total} commande(s)
          </div>
        )}
      </div>
    </>
  );
}
