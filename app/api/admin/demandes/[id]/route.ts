import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function GET(_requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/demandes/${id}`);
  return NextResponse.json(corps, { status: statut });
}

export async function PATCH(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/demandes/${id}`, { method: "PATCH", body: corpsClient });
  return NextResponse.json(corps, { status: statut });
}
