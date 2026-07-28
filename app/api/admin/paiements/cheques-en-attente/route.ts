import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function GET() {
  const { statut, corps } = await apiBackendAuthentifie("/api/admin/paiements/cheques-en-attente");
  return NextResponse.json(corps, { status: statut });
}
