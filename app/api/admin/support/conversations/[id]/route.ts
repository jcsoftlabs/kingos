import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function GET(_requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/support/conversations/${id}`);
  return NextResponse.json(corps, { status: statut });
}
