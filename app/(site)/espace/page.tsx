import { redirect } from "next/navigation";
import { obtenirUtilisateurCourant, ROLES_BACK_OFFICE } from "@/lib/auth-serveur";
import { FormulaireConnexion } from "@/components/auth/FormulaireConnexion";
import { BoutonDeconnexion } from "@/components/auth/BoutonDeconnexion";

export const metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic"; // dépend du cookie de session, jamais mis en cache

const LIBELLES_ROLE: Record<string, string> = {
  CLIENT: "Client",
  ADMIN: "Administrateur",
  COMMERCIAL: "Commercial",
  PRODUCTION: "Production",
  LECTURE: "Lecture seule",
  SUPER_ADMIN: "Super administrateur",
};

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
        <p className="mt-3 text-marine-400">Connectez-vous avec les identifiants de votre compte client.</p>
        <div className="mt-8">
          <FormulaireConnexion />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Espace client</p>
      <h1 className="mt-2 text-3xl font-extrabold text-marine-500">
        Bonjour {utilisateur.prenom ?? utilisateur.nom}
      </h1>
      <div className="mt-6 rounded-marque border border-marine-100 bg-white p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-marine-400">E-mail</dt>
            <dd className="font-bold text-marine-500">{utilisateur.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-marine-400">Rôle</dt>
            <dd className="font-bold text-marine-500">{LIBELLES_ROLE[utilisateur.role] ?? utilisateur.role}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-6 text-sm text-marine-400">
        Le suivi des commandes, devis et factures arrive avec la suite du module Espace client.
      </p>

      <div className="mt-8">
        <BoutonDeconnexion />
      </div>
    </section>
  );
}
