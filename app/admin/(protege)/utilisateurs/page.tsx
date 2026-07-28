import { redirect } from "next/navigation";
import { apiBackendAuthentifie, obtenirUtilisateurCourant } from "@/lib/auth-serveur";
import { FormulaireNouvelUtilisateur } from "@/components/admin/utilisateurs/FormulaireNouvelUtilisateur";
import { BoutonActivation } from "@/components/admin/utilisateurs/BoutonActivation";

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
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-marine-500">Utilisateurs</h1>
        <FormulaireNouvelUtilisateur />
      </div>
      <p className="mt-2 max-w-2xl text-sm text-marine-400">
        Comptes du personnel Kingo&apos;s — administrateur, commercial, production, lecture seule. Les comptes
        client s&apos;inscrivent eux-mêmes via le parcours devis, pas ici.
      </p>

      <div className="mt-8 overflow-x-auto rounded-marque border border-marine-100 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-marine-100 bg-creme-200 text-left text-xs font-bold uppercase tracking-wide text-marine-400">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marine-100">
            {utilisateurs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-marine-400">
                  Aucun compte staff pour l&apos;instant.
                </td>
              </tr>
            ) : (
              utilisateurs.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-bold text-marine-500">
                    {u.prenom ? `${u.prenom} ${u.nom}` : u.nom}
                  </td>
                  <td className="px-4 py-3 text-marine-400">{u.email}</td>
                  <td className="px-4 py-3 text-marine-400">{LIBELLES_ROLE[u.role] ?? u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-marque px-2.5 py-1 text-xs font-bold ${
                        u.actif ? "bg-foret-50 text-foret-600" : "bg-creme-300 text-marine-400"
                      }`}
                    >
                      {u.actif ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "SUPER_ADMIN" && <BoutonActivation utilisateurId={u.id} actif={u.actif} />}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
