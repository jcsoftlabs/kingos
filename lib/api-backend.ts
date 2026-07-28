import "server-only";

/**
 * Client HTTP vers l'API Railway — appelé uniquement depuis des composants
 * serveur ou des Route Handlers, jamais depuis le navigateur (plan §1.2).
 * L'URL de l'API et le jeton de service ne quittent donc jamais le serveur.
 */

const URL_API = process.env.URL_API;
const JETON_SERVICE = process.env.JETON_SERVICE;

if (!URL_API) throw new Error("URL_API manquant dans l'environnement");

export interface ReponseApi<T> {
  succes: boolean;
  donnees?: T;
  erreur?: { code: string; message: string; details?: unknown };
}

export async function apiBackend<T>(
  chemin: string,
  options: RequestInit & { revalidate?: number | false } = {},
): Promise<{ statut: number; corps: ReponseApi<T> }> {
  const { revalidate, ...init } = options;

  const reponse = await fetch(`${URL_API}${chemin}`, {
    ...init,
    headers: {
      // Content-Type uniquement s'il y a un corps : Fastify rejette (400)
      // un POST avec Content-Type JSON et un corps vide.
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(JETON_SERVICE ? { "X-Jeton-Service": JETON_SERVICE } : {}),
      ...init.headers,
    },
    next: revalidate === false ? { revalidate: 0 } : revalidate !== undefined ? { revalidate } : undefined,
    cache: init.cache,
  });

  const corps = (await reponse.json()) as ReponseApi<T>;
  return { statut: reponse.status, corps };
}
