import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function GET(requete: Request) {
  const { search } = new URL(requete.url);
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/contrats${search}`);
  return NextResponse.json(corps, { status: statut });
}

export async function POST(requete: Request) {
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie("/api/admin/contrats", { method: "POST", body: corpsClient });
  return NextResponse.json(corps, { status: statut });
}
