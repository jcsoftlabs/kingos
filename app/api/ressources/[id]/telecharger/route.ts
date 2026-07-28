import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

export async function GET(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const format = new URL(requete.url).searchParams.get("format") ?? "";
  const { statut, corps } = await apiBackend(`/api/ressources/${id}/telecharger?format=${encodeURIComponent(format)}`, {
    revalidate: false,
  });
  return NextResponse.json(corps, { status: statut });
}
