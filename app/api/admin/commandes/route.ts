import { NextResponse } from "next/server";
import { obtenirUtilisateurCourant, ROLES_BACK_OFFICE } from "@/lib/auth-serveur";
import { apiBackend } from "@/lib/api-backend";

// Le staff crée une commande au nom d'un client (téléphone, comptoir) —
// on appelle le POST public du backend SANS transmettre la session du
// staff : sinon utilisateurOptionnel() rattacherait la commande au compte
// du membre du personnel plutôt qu'à personne (voir commandes/service.ts).
// Cette route ne fait que vérifier qu'un membre du back-office est bien
// connecté avant d'autoriser l'appel.
export async function POST(requete: Request) {
  const utilisateur = await obtenirUtilisateurCourant();
  if (!utilisateur || !ROLES_BACK_OFFICE.includes(utilisateur.role as (typeof ROLES_BACK_OFFICE)[number])) {
    return NextResponse.json({ succes: false, erreur: { code: "NON_AUTORISE", message: "Authentification requise" } }, { status: 401 });
  }

  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackend("/api/commandes", { method: "POST", body: corpsClient, revalidate: false });
  return NextResponse.json(corps, { status: statut });
}
