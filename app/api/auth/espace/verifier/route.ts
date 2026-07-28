import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";
import { definirCookieSession } from "@/lib/session";

export async function POST(requete: Request) {
  const corpsClient = await requete.text();

  const { statut, corps } = await apiBackend<{ utilisateur: unknown; jeton: string }>("/api/auth/espace/verifier", {
    method: "POST",
    body: corpsClient,
    revalidate: false,
  });

  if (!corps.succes || !corps.donnees) {
    return NextResponse.json(corps, { status: statut });
  }

  await definirCookieSession(corps.donnees.jeton);

  return NextResponse.json({ succes: true, donnees: { utilisateur: corps.donnees.utilisateur } }, { status: statut });
}
