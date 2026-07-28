import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { redirect } from "next/navigation";
import { obtenirUtilisateurCourant, ROLES_BACK_OFFICE } from "@/lib/auth-serveur";
import { FormulaireConnexion } from "@/components/auth/FormulaireConnexion";
import { AtelierImpression } from "@/components/illustrations/AtelierImpression";

export const metadata = { title: "Connexion — Back-office Kingo's" };
export const dynamic = "force-dynamic";

// Une vraie photo d'atelier prend le dessus dès qu'elle est déposée dans
// public/ ; sinon on affiche l'illustration SVG, qui ne dépend d'aucun asset.
const PHOTO_ATELIER = "/atelier-impression.jpg";

export default async function PageConnexionAdmin() {
  const utilisateur = await obtenirUtilisateurCourant();
  if (utilisateur && ROLES_BACK_OFFICE.includes(utilisateur.role as (typeof ROLES_BACK_OFFICE)[number])) {
    redirect("/admin");
  }

  const photoDisponible = existsSync(join(process.cwd(), "public", PHOTO_ATELIER));

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-marine-600 px-4 py-12">
      <div className="absolute inset-0">
        {photoDisponible ? (
          <Image src={PHOTO_ATELIER} alt="" fill priority className="object-cover" />
        ) : (
          <AtelierImpression className="h-full w-full" />
        )}
        {/* Voile sombre : garantit le contraste du formulaire quelle que soit l'image. */}
        <div className="absolute inset-0 bg-marine-700/70 backdrop-blur-[2px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center">
          <Image
            src="/logo-kingos.png"
            alt="Kingo's"
            width={420}
            height={420}
            priority
            className="h-20 w-auto brightness-0 invert drop-shadow-lg"
          />
        </div>

        <div className="mt-8 rounded-2xl bg-white/95 p-8 shadow-2xl shadow-black/40 backdrop-blur">
          <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-magenta-500">Back-office</p>
          <h1 className="mt-1 text-center text-xl font-extrabold tracking-tight text-marine-500">Espace équipe</h1>
          <p className="mt-1.5 text-center text-sm text-marine-400">Réservé au personnel Kingo&apos;s.</p>

          <div className="mt-7">
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
