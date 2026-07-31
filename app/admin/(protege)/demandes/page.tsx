import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { EntetePage } from "@/components/admin/EntetePage";

export const metadata = { title: "Demandes — Admin" };

const LIBELLES_STATUT: Record<string, string> = {
  NOUVELLE: "Nouvelle",
  EN_COURS: "En cours",
  TRAITEE: "Traitée",
  REJETEE: "Rejetée",
};
const STYLES_STATUT: Record<string, string> = {
  NOUVELLE: "bg-magenta-50 text-magenta-600",
  EN_COURS: "bg-lime-100 text-lime-700",
  TRAITEE: "bg-foret-50 text-foret-700",
  REJETEE: "bg-marine-50 text-marine-400",
};

interface Demande {
  id: string;
  nomContact: string;
  emailContact: string;
  description: string;
  statut: string;
  creeLe: string;
}

export default async function PageDemandesAdmin() {
  const { corps } = await apiBackendAuthentifie<Demande[]>("/api/admin/demandes");
  const demandes = corps.succes && corps.donnees ? corps.donnees : [];

  return (
    <>
      <EntetePage
        titre="Demandes"
        description="Requêtes hors catalogue laissées par les visiteurs — service sur mesure, réparation, conseil."
      />

      <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Besoin</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3">Reçue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {demandes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-marine-400">
                    Aucune demande pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                demandes.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3">
                      <Link href={`/admin/demandes/${d.id}`} className="font-bold text-marine-500 hover:text-magenta-500 hover:underline">
                        {d.nomContact}
                      </Link>
                      <div className="text-xs text-marine-400">{d.emailContact}</div>
                    </td>
                    <td className="max-w-sm truncate px-5 py-3 text-marine-500">{d.description}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${STYLES_STATUT[d.statut]}`}>
                        {LIBELLES_STATUT[d.statut] ?? d.statut}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                      {new Date(d.creeLe).toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" })}
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
