import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { EntetePage } from "@/components/admin/EntetePage";
import { FormulaireNouveauContrat } from "@/components/admin/contrats/FormulaireNouveauContrat";

export const metadata = { title: "Contrats — Admin" };

const LIBELLES_STATUT: Record<string, string> = { ACTIF: "Actif", SUSPENDU: "Suspendu", RESILIE: "Résilié", EXPIRE: "Expiré" };
const STYLES_STATUT: Record<string, string> = {
  ACTIF: "bg-foret-50 text-foret-700",
  SUSPENDU: "bg-lime-100 text-lime-700",
  RESILIE: "bg-magenta-50 text-magenta-600",
  EXPIRE: "bg-marine-50 text-marine-400",
};

interface Contrat {
  id: string;
  numero: string;
  nomClient: string;
  entreprise: string | null;
  objet: string;
  statut: string;
  dateDebut: string;
  dateFin: string | null;
  _count: { commandes: number };
}

export default async function PageContratsAdmin() {
  const { corps } = await apiBackendAuthentifie<Contrat[]>("/api/admin/contrats");
  const contrats = corps.succes && corps.donnees ? corps.donnees : [];

  return (
    <>
      <EntetePage
        titre="Contrats"
        description="Accords récurrents avec des clients institutionnels — remise et délai de paiement convenus une fois, pas à chaque commande."
      >
        <FormulaireNouveauContrat />
      </EntetePage>

      <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Contrat</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Commandes</th>
                <th className="px-5 py-3">Début</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {contrats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-marine-400">
                    Aucun contrat pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                contrats.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3">
                      <Link href={`/admin/contrats/${c.id}`} className="font-bold text-marine-500 hover:text-magenta-500 hover:underline">
                        {c.numero}
                      </Link>
                      <div className="text-xs text-marine-400">{c.objet}</div>
                    </td>
                    <td className="px-5 py-3 text-marine-500">{c.entreprise || c.nomClient}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${STYLES_STATUT[c.statut]}`}>
                        {LIBELLES_STATUT[c.statut] ?? c.statut}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">{c._count.commandes}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                      {new Date(c.dateDebut).toLocaleDateString("fr-HT", { timeZone: "UTC" })}
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
