import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

// Proxy vers l'API Railway — voir plan §1.2 : le navigateur ne parle jamais
// directement au backend. Débit limité côté backend (30/min) ; ce proxy ne
// fait qu'ajouter le jeton de service, invisible du client.
export async function POST(requete: Request) {
  const corpsClient = await requete.json();
  const { statut, corps } = await apiBackend("/api/devis/simuler", {
    method: "POST",
    body: JSON.stringify(corpsClient),
    revalidate: false,
  });
  return NextResponse.json(corps, { status: statut });
}
