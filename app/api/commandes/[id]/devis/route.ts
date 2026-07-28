import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

export async function POST(_requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { statut, corps } = await apiBackend(`/api/commandes/${id}/devis`, { method: "POST", revalidate: false });
  return NextResponse.json(corps, { status: statut });
}
