import { redirect } from "next/navigation";
import { apiBackendAuthentifie, obtenirUtilisateurCourant } from "@/lib/auth-serveur";
import { FormulaireNouvelUtilisateur } from "@/components/admin/utilisateurs/FormulaireNouvelUtilisateur";
import { GestionCompte } from "@/components/admin/utilisateurs/GestionCompte";
import { EntetePage } from "@/components/admin/EntetePage";

export const metadata = { title: "Utilisateurs — Admin" };

const LIBELLES_ROLE: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  COMMERCIAL: "Commercial",
  PRODUCTION: "Production",
  LECTURE: "Lecture seule",
};

interface UtilisateurBackOffice {
  id: string;
  email: string;
  nom: string;
  prenom: string | null;
  role: string;
  actif: boolean;
  derniereConnexion: string | null;
}

export default async function PageUtilisateursAdmin() {
  // La création de comptes staff est réservée au SUPER_ADMIN côté API — on
  // évite d'afficher un tableau vide silencieux aux autres rôles back-office.
  const utilisateurCourant = await obtenirUtilisateurCourant();
  if (utilisateurCourant?.role !== "SUPER_ADMIN") redirect("/admin");

  const { corps } = await apiBackendAuthentifie<UtilisateurBackOffice[]>("/api/admin/utilisateurs");
  const utilisateurs = corps.succes && corps.donnees ? corps.donnees : [];

  return (
    <>
      <EntetePage
        titre="Utilisateurs"
        description="Comptes du personnel Kingo's — administrateur, commercial, production, lecture seule. Les comptes client s'inscrivent eux-mêmes via le parcours devis, pas ici."
      >
        <FormulaireNouvelUtilisateur />
      </EntetePage>

      <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">E-mail</th>
                <th className="px-5 py-3">Rôle</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {utilisateurs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-marine-400">
                    Aucun compte staff pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                utilisateurs.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3 font-bold text-marine-500">
                      {u.prenom ? `${u.prenom} ${u.nom}` : u.nom}
                    </td>
                    <td className="px-5 py-3 text-marine-400">{u.email}</td>
                    <td className="px-5 py-3 text-marine-400">{LIBELLES_ROLE[u.role] ?? u.role}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${
                          u.actif
                            ? "bg-foret-50 text-foret-600 ring-foret-100"
                            : "bg-marine-50 text-marine-400 ring-marine-100"
                        }`}
                      >
                        {u.actif ? "Actif" : "Désactivé"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {u.role !== "SUPER_ADMIN" && <GestionCompte utilisateurId={u.id} role={u.role} actif={u.actif} />}
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
