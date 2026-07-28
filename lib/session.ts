import "server-only";
import { cookies } from "next/headers";

// Cookie posé sur le domaine Vercel uniquement (plan §1.2, §11.1) — le jeton
// de session brut ne transite jamais côté client en dehors de ce cookie
// httpOnly, et l'API Railway ne le voit que via l'en-tête X-Jeton-Session
// que le BFF rajoute lui-même.
export const NOM_COOKIE_SESSION = "kingos_session";

export async function definirCookieSession(jeton: string) {
  const magasin = await cookies();
  magasin.set(NOM_COOKIE_SESSION, jeton, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 jours, aligné sur la durée de session backend
  });
}

export async function effacerCookieSession() {
  const magasin = await cookies();
  magasin.delete(NOM_COOKIE_SESSION);
}

export async function lireJetonSession(): Promise<string | undefined> {
  const magasin = await cookies();
  return magasin.get(NOM_COOKIE_SESSION)?.value;
}
