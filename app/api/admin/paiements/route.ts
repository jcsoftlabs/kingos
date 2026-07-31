import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function POST(requete: Request) {
  const corpsClient = await requete.text();
  // Sans ce relais, la clé d'idempotence serait perdue ici et un réessai
  // après erreur réseau créerait un second encaissement.
  const cle = requete.headers.get("idempotency-key");
  const { statut, corps } = await apiBackendAuthentifie("/api/paiements/manuel", {
    method: "POST",
    body: corpsClient,
    headers: cle ? { "Idempotency-Key": cle } : undefined,
  });
  return NextResponse.json(corps, { status: statut });
}
