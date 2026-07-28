import "server-only";
import { apiBackend } from "./api-backend";
import { lireJetonSession } from "./session";

export interface UtilisateurCourant {
  id: string;
  email: string;
  role: "CLIENT" | "ADMIN" | "COMMERCIAL" | "PRODUCTION" | "LECTURE" | "SUPER_ADMIN";
  nom: string;
  prenom: string | null;
}

/** À utiliser dans les composants serveur (pages, layouts) pour savoir qui est connecté. */
export async function obtenirUtilisateurCourant(): Promise<UtilisateurCourant | null> {
  const jeton = await lireJetonSession();
  if (!jeton) return null;

  const { statut, corps } = await apiBackend<UtilisateurCourant>("/api/auth/moi", {
    headers: { "X-Jeton-Session": jeton },
    revalidate: false,
  });

  if (statut !== 200 || !corps.succes || !corps.donnees) return null;
  return corps.donnees;
}

export const ROLES_BACK_OFFICE = ["SUPER_ADMIN", "ADMIN", "COMMERCIAL", "PRODUCTION", "LECTURE"] as const;
