import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function GET(_requete: Request, { params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const { statut, corps } = await apiBackendAuthentifie(`/api/devis/${numero}/pdf`);
  return NextResponse.json(corps, { status: statut });
}
