import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function POST(requete: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/inventaire/articles/${id}/mouvements`, {
    method: "POST",
    body: corpsClient,
  });
  if (corps.succes) revalidatePath("/admin/inventaire");
  return NextResponse.json(corps, { status: statut });
}
