import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { obtenirUtilisateurCourant, ROLES_BACK_OFFICE } from "@/lib/auth-serveur";
import { BoutonDeconnexion } from "@/components/auth/BoutonDeconnexion";

export const dynamic = "force-dynamic"; // tout dépend du rôle de la session courante

const LIENS = [
  { href: "/admin", libelle: "Tableau de bord" },
  { href: "/admin/commandes", libelle: "Commandes" },
  { href: "/admin/devis", libelle: "Devis" },
  { href: "/admin/factures", libelle: "Factures" },
];

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const utilisateur = await obtenirUtilisateurCourant();

  if (!utilisateur) redirect("/espace");
  if (!ROLES_BACK_OFFICE.includes(utilisateur.role as (typeof ROLES_BACK_OFFICE)[number])) {
    redirect("/espace");
  }

  return (
    <div className="flex min-h-screen bg-creme-100">
      <aside className="flex w-60 flex-col bg-marine-500 text-creme-100 print:hidden">
        <div className="flex items-center gap-2 px-6 py-5">
          <Image src="/logo-kingos.png" alt="Kingo's" width={100} height={100} className="h-8 w-auto brightness-0 invert" />
          <span className="text-xs font-bold uppercase tracking-wide text-lime">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="block rounded-marque px-3 py-2 text-sm font-bold text-creme-100 hover:bg-marine-600 hover:text-magenta-300"
            >
              {lien.libelle}
            </Link>
          ))}
        </nav>
        <div className="border-t border-marine-400/40 px-6 py-4">
          <p className="text-xs text-marine-100">{utilisateur.email}</p>
          <p className="text-xs font-bold text-lime">{utilisateur.role}</p>
          <div className="mt-3">
            <BoutonDeconnexion variante="contourClair" />
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 print:p-0">{children}</main>
    </div>
  );
}
