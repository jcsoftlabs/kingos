import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function PATCH(requete: Request, { params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/clients/${email}`, { method: "PATCH", body: corpsClient });
  return NextResponse.json(corps, { status: statut });
}
