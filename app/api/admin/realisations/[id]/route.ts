import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function PATCH(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/realisations/${id}`, { method: "PATCH", body: corpsClient });
  if (corps.succes) revalidatePath("/realisations");
  return NextResponse.json(corps, { status: statut });
}

export async function DELETE(_requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/realisations/${id}`, { method: "DELETE" });
  if (corps.succes) revalidatePath("/realisations");
  return NextResponse.json(corps, { status: statut });
}
