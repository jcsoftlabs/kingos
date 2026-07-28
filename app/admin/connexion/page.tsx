import Image from "next/image";
import { redirect } from "next/navigation";
import { obtenirUtilisateurCourant, ROLES_BACK_OFFICE } from "@/lib/auth-serveur";
import { FormulaireConnexion } from "@/components/auth/FormulaireConnexion";

export const metadata = { title: "Connexion — Back-office Kingo's" };
export const dynamic = "force-dynamic";

export default async function PageConnexionAdmin() {
  const utilisateur = await obtenirUtilisateurCourant();
  if (utilisateur && ROLES_BACK_OFFICE.includes(utilisateur.role as (typeof ROLES_BACK_OFFICE)[number])) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-marine-500 px-4">
      <div className="w-full max-w-sm rounded-marque bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <Image src="/logo-kingos.png" alt="Kingo's" width={140} height={140} className="h-12 w-auto" />
        </div>
        <p className="mt-6 text-center text-sm font-bold uppercase tracking-wide text-magenta-500">Back-office</p>
        <h1 className="mt-1 text-center text-xl font-extrabold text-marine-500">Espace équipe</h1>
        <p className="mt-2 text-center text-sm text-marine-400">Réservé au personnel Kingo&apos;s.</p>
        <div className="mt-8">
          <FormulaireConnexion apresConnexion="/admin" />
        </div>
      </div>
    </div>
  );
}
