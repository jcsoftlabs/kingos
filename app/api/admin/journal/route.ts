import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function GET(requete: Request) {
  const { search } = new URL(requete.url);
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/journal${search}`);
  return NextResponse.json(corps, { status: statut });
}
