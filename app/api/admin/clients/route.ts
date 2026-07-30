import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function GET(requete: Request) {
  const { search } = new URL(requete.url);
  const { statut, corps } = await apiBackendAuthentifie(`/api/admin/clients${search}`);
  return NextResponse.json(corps, { status: statut });
}

export async function POST(requete: Request) {
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie("/api/admin/clients", { method: "POST", body: corpsClient });
  if (corps.succes) revalidatePath("/admin/clients");
  return NextResponse.json(corps, { status: statut });
}
