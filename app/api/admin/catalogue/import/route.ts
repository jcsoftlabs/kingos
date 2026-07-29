import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function POST(requete: Request) {
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie("/api/admin/catalogue/import", { method: "POST", body: corpsClient });
  if (corps.succes) revalidatePath("/services");
  return NextResponse.json(corps, { status: statut });
}
