import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function PATCH(requete: Request) {
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie("/api/admin/parametres", {
    method: "PATCH",
    body: corpsClient,
  });
  return NextResponse.json(corps, { status: statut });
}
