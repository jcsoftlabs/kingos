import Image from "next/image";
import { redirect } from "next/navigation";
import { obtenirUtilisateurCourant, apiBackendAuthentifie, ROLES_BACK_OFFICE } from "@/lib/auth-serveur";
import { BoutonDeconnexionAdmin } from "@/components/admin/BoutonDeconnexionAdmin";
import { NavigationAdmin, type Section } from "@/components/admin/NavigationAdmin";

export const dynamic = "force-dynamic"; // tout dépend du rôle de la session courante

const LIBELLES_ROLE: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  COMMERCIAL: "Commercial",
  PRODUCTION: "Production",
  LECTURE: "Lecture seule",
};

const SECTIONS: Section[] = [
  {
    titre: "Pilotage",
    liens: [{ href: "/admin", libelle: "Tableau de bord", icone: "tableau" }],
  },
  {
    titre: "Activité",
    liens: [
      { href: "/admin/ventes-rapides", libelle: "Vente rapide", icone: "eclair" },
      { href: "/admin/commandes", libelle: "Commandes", icone: "panier" },
      { href: "/admin/devis", libelle: "Devis", icone: "devis" },
      { href: "/admin/factures", libelle: "Factures", icone: "facture" },
      { href: "/admin/paiements", libelle: "Chèques en attente", icone: "cheque" },
      { href: "/admin/clients", libelle: "Clients", icone: "clients" },
      { href: "/admin/support", libelle: "Support", icone: "support" },
    ],
  },
  {
    titre: "Contenu",
    liens: [
      { href: "/admin/realisations", libelle: "Réalisations", icone: "realisations" },
      { href: "/admin/ressources", libelle: "Ressources", icone: "ressources" },
    ],
  },
  {
    titre: "Configuration",
    liens: [
      { href: "/admin/catalogue", libelle: "Catalogue", icone: "catalogue" },
      { href: "/admin/utilisateurs", libelle: "Utilisateurs", icone: "utilisateurs" },
      { href: "/admin/parametres", libelle: "Paramètres", icone: "reglages" },
      { href: "/admin/journal", libelle: "Journal d'audit", icone: "journal" },
    ],
  },
];

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const utilisateur = await obtenirUtilisateurCourant();

  // Le back-office a son propre écran de connexion (/admin/connexion) —
  // le partager avec la page client /espace créait une confusion signalée
  // (un staff qui atterrit sur une page visiblement "compte client").
  if (!utilisateur) redirect("/admin/connexion");
  if (!ROLES_BACK_OFFICE.includes(utilisateur.role as (typeof ROLES_BACK_OFFICE)[number])) {
    redirect("/admin/connexion");
  }

  // Gestion des comptes staff et journal d'audit : réservés au SUPER_ADMIN.
  const LIENS_SUPER_ADMIN = ["/admin/utilisateurs", "/admin/journal"];

  interface ConversationSupportResume { nbNonLus: number; statut: string }
  const { corps: corpsSupport } = await apiBackendAuthentifie<ConversationSupportResume[]>("/api/admin/support/conversations");
  const nbConversationsEnAttente =
    corpsSupport.succes && corpsSupport.donnees
      ? corpsSupport.donnees.filter((c) => c.statut === "OUVERTE" && c.nbNonLus > 0).length
      : 0;

  const sections = SECTIONS.map((section) => ({
    ...section,
    liens: section.liens
      .filter((l) => !LIENS_SUPER_ADMIN.includes(l.href) || utilisateur.role === "SUPER_ADMIN")
      .map((l) => (l.href === "/admin/support" ? { ...l, badge: nbConversationsEnAttente } : l)),
  })).filter((section) => section.liens.length > 0);

  const initiales = `${utilisateur.prenom?.[0] ?? ""}${utilisateur.nom[0] ?? ""}`.toUpperCase() || "K";

  return (
    <div className="flex min-h-screen bg-creme-100">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col bg-marine-600 print:hidden">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <Image src="/logo-kingos.png" alt="Kingo's" width={120} height={120} className="h-7 w-auto brightness-0 invert" />
          <span className="rounded bg-magenta-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Admin
          </span>
        </div>

        <NavigationAdmin sections={sections} />

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2.5 rounded-marque px-2 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-magenta-500 text-xs font-bold text-white">
              {initiales}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{utilisateur.email}</p>
              <p className="truncate text-[11px] text-marine-200">
                {LIBELLES_ROLE[utilisateur.role] ?? utilisateur.role}
              </p>
            </div>
          </div>
          <div className="mt-1.5">
            <BoutonDeconnexionAdmin />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pl-60 print:pl-0">
        <main className="flex-1 p-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}
