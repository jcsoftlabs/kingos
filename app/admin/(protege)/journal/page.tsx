import { redirect } from "next/navigation";
import { apiBackendAuthentifie, obtenirUtilisateurCourant } from "@/lib/auth-serveur";
import { EntetePage } from "@/components/admin/EntetePage";

export const metadata = { title: "Journal d'audit — Admin" };
export const dynamic = "force-dynamic";

interface EntreeJournal {
  id: string;
  action: string;
  entite: string;
  entiteId: string;
  avant: unknown;
  apres: unknown;
  adresseIp: string | null;
  creeLe: string;
  acteur: { id: string; email: string; nom: string; prenom: string | null } | null;
  acteurRole: string | null;
}

const LIBELLES_ACTION: Record<string, string> = {
  CONNEXION: "Connexion",
  COMMANDE_STATUT_MODIFIE: "Statut de commande modifié",
  FACTURE_EMISE: "Facture émise",
  FACTURE_ECHEANCE_MODIFIEE: "Échéance de facture modifiée",
  PAIEMENT_ENREGISTRE: "Paiement enregistré",
  CHEQUE_ENCAISSE: "Chèque encaissé",
  CHEQUE_REJETE: "Chèque rejeté",
  VENTE_RAPIDE_CREEE: "Vente rapide",
  UTILISATEUR_CREE: "Compte staff créé",
  UTILISATEUR_DESACTIVE: "Compte staff désactivé",
  UTILISATEUR_REACTIVE: "Compte staff réactivé",
  PARAMETRES_MODIFIES: "Paramètres entreprise modifiés",
};

export default async function PageJournalAudit({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const utilisateur = await obtenirUtilisateurCourant();
  if (utilisateur?.role !== "SUPER_ADMIN") redirect("/admin");

  const params = await searchParams;
  const requete = new URLSearchParams();
  if (params.page) requete.set("page", params.page);

  const { corps } = await apiBackendAuthentifie<EntreeJournal[]>(`/api/admin/journal?${requete.toString()}`);
  const entrees = corps.succes && corps.donnees ? corps.donnees : [];

  return (
    <>
      <EntetePage titre="Journal d'audit" description="Qui a fait quoi — paiements, comptes staff, paramètres, connexions back-office." />

      <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Acteur</th>
                <th className="px-5 py-3">Cible</th>
                <th className="px-5 py-3">Quand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {entrees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-marine-400">
                    Aucun événement pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                entrees.map((e) => (
                  <tr key={e.id}>
                    <td className="px-5 py-3 font-bold text-marine-500">{LIBELLES_ACTION[e.action] ?? e.action}</td>
                    <td className="px-5 py-3">
                      {e.acteur ? (
                        <>
                          <div className="text-marine-500">{e.acteur.email}</div>
                          <div className="text-xs text-marine-400">{e.acteurRole}</div>
                        </>
                      ) : (
                        <span className="text-marine-300">Système</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-marine-400">
                      {e.entite} <span className="font-mono text-xs">{e.entiteId.slice(0, 8)}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                      {new Date(e.creeLe).toLocaleString("fr-HT", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "America/Port-au-Prince",
                      })}
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
