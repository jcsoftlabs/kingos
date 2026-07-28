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
    <div className="flex min-h-screen items-center justify-center bg-marine-600 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/logo-kingos.png" alt="Kingo's" width={200} height={200} className="h-11 w-auto brightness-0 invert" />
        </div>

        <div className="mt-8 rounded-xl bg-white p-8 shadow-2xl shadow-black/20">
          <h1 className="text-lg font-extrabold tracking-tight text-marine-500">Back-office</h1>
          <p className="mt-1 text-sm text-marine-400">Accès réservé au personnel Kingo&apos;s.</p>

          <div className="mt-6">
            <FormulaireConnexion apresConnexion="/admin" />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-marine-200">
          © {new Date().getFullYear()} Kingo&apos;s — Design &amp; Impression Professionnelle
        </p>
      </div>
    </div>
  );
}
