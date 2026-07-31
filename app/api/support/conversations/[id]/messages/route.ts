import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

export async function POST(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackend(`/api/support/conversations/${id}/messages`, {
    method: "POST",
    body: corpsClient,
    revalidate: false,
  });
  return NextResponse.json(corps, { status: statut });
}
