import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";
import { definirCookieSession } from "@/lib/session";

export async function POST(requete: Request) {
  const corpsClient = await requete.json();

  const { statut, corps } = await apiBackend<{ utilisateur: unknown; jeton: string }>("/api/auth/connexion", {
    method: "POST",
    body: JSON.stringify(corpsClient),
    revalidate: false,
  });

  if (!corps.succes || !corps.donnees) {
    return NextResponse.json(corps, { status: statut });
  }

  // Le jeton brut ne sort jamais de ce Route Handler : posé en cookie httpOnly
  // côté serveur, jamais renvoyé dans le JSON au navigateur (plan §1.2/§11.1).
  await definirCookieSession(corps.donnees.jeton);

  return NextResponse.json(
    { succes: true, donnees: { utilisateur: corps.donnees.utilisateur } },
    { status: statut },
  );
}
