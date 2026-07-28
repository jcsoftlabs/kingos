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

/** Requête authentifiée vers l'API — pages /admin et Route Handlers de mutation. */
export async function apiBackendAuthentifie<T>(
  chemin: string,
  options: { method?: string; body?: string } = {},
) {
  const jeton = await lireJetonSession();
  if (!jeton) return { statut: 401 as const, corps: { succes: false as const } };
  return apiBackend<T>(chemin, {
    method: options.method,
    body: options.body,
    headers: { "X-Jeton-Session": jeton },
    revalidate: false,
  });
}

/**
 * Requête authentifiée qui renvoie la Response brute plutôt que du JSON —
 * pour les routes qui streament un fichier (export CSV) au lieu du format
 * { succes, donnees } habituel. apiBackend() fait toujours .json(), ce qui
 * casserait sur un flux CSV.
 */
export async function apiBackendFluxAuthentifie(chemin: string): Promise<Response | null> {
  const jeton = await lireJetonSession();
  if (!jeton) return null;

  const URL_API = process.env.URL_API;
  const JETON_SERVICE = process.env.JETON_SERVICE;
  if (!URL_API) throw new Error("URL_API manquant dans l'environnement");
  const racineApi = URL_API.replace(/\/+$/, "");

  return fetch(`${racineApi}${chemin}`, {
    headers: {
      "X-Jeton-Session": jeton,
      ...(JETON_SERVICE ? { "X-Jeton-Service": JETON_SERVICE } : {}),
    },
    cache: "no-store",
  });
}
