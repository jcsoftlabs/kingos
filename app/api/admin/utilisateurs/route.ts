import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function POST(requete: Request) {
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie("/api/admin/utilisateurs", {
    method: "POST",
    body: corpsClient,
  });
  return NextResponse.json(corps, { status: statut });
}
