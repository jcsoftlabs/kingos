import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

export async function POST(requete: Request) {
  const corpsClient = await requete.json();

  // Clé d'idempotence côté serveur : si le navigateur n'en a pas fourni une
  // (premier essai), on en génère une et on ne la régénère pas au retry —
  // c'est justement le rôle du client de la répéter sur un nouvel essai.
  const cleIdempotence = requete.headers.get("idempotency-key") ?? crypto.randomUUID();

  const { statut, corps } = await apiBackend("/api/commandes", {
    method: "POST",
    headers: { "Idempotency-Key": cleIdempotence },
    body: JSON.stringify(corpsClient),
    revalidate: false,
  });
  return NextResponse.json(corps, { status: statut });
}
