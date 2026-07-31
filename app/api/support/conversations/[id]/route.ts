import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

export async function GET(_requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { statut, corps } = await apiBackend(`/api/support/conversations/${id}`, { revalidate: false });
  return NextResponse.json(corps, { status: statut });
}
