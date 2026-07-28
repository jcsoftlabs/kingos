import { redirect } from "next/navigation";
import { obtenirUtilisateurCourant, apiBackendAuthentifie, ROLES_BACK_OFFICE } from "@/lib/auth-serveur";
import { FormulaireConnexionEspace } from "@/components/auth/FormulaireConnexionEspace";
import { BoutonDeconnexion } from "@/components/auth/BoutonDeconnexion";
import { TableauDeBordClient } from "@/components/espace/TableauDeBordClient";

export const metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic"; // dépend du cookie de session, jamais mis en cache

interface MesDonnees {
  commandes: { id: string; numero: string; statut: string; totalCents: string; creeLe: string; lignes: { serviceNom: string; quantite: number }[] }[];
  devis: { id: string; numero: string; statut: string; totalCents: string; creeLe: string; expireLe: string }[];
  factures: { id: string; numero: string; statut: string; totalCents: string; payeCents: string; echeanceLe: string | null; creeLe: string }[];
}

export default async function PageEspaceClient() {
  const utilisateur = await obtenirUtilisateurCourant();

  // Un compte back-office qui atterrit ici (login direct, ou redirigé depuis
  // /admin faute de session) n'a rien à faire sur la fiche profil client —
  // direction le back-office. C'était la confusion signalée : /admin
  // renvoyait vers une page visiblement "client", pas un vrai portail staff.
  if (utilisateur && ROLES_BACK_OFFICE.includes(utilisateur.role as (typeof ROLES_BACK_OFFICE)[number])) {
    redirect("/admin");
  }

  if (!utilisateur) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Connexion</p>
        <h1 className="mt-2 text-3xl font-extrabold text-marine-500">Accédez à votre compte</h1>
        <p className="mt-3 text-marine-400">Retrouvez l&apos;historique de vos commandes, devis et factures.</p>
        <div className="mt-8">
          <FormulaireConnexionEspace />
        </div>
      </section>
    );
  }

  const { corps } = await apiBackendAuthentifie<MesDonnees>("/api/espace/mes-donnees");
  const donnees = corps.succes && corps.donnees ? corps.donnees : { commandes: [], devis: [], factures: [] };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Espace client</p>
          <h1 className="mt-1 text-2xl font-extrabold text-marine-500">
            Bonjour {utilisateur.prenom ?? utilisateur.nom}
          </h1>
          <p className="text-sm text-marine-400">{utilisateur.email}</p>
        </div>
        <BoutonDeconnexion />
      </div>

      <div className="mt-8">
        <TableauDeBordClient commandes={donnees.commandes} devis={donnees.devis} factures={donnees.factures} />
      </div>
    </section>
  );
}
