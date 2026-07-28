import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function POST(_requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { statut, corps } = await apiBackendAuthentifie(`/api/paiements/${id}/encaisser`, { method: "POST", body: "{}" });
  return NextResponse.json(corps, { status: statut });
}
