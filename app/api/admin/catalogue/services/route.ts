import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function POST(requete: Request) {
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackendAuthentifie("/api/admin/catalogue/services", {
    method: "POST",
    body: corpsClient,
  });
  // Sans ça, /services (ISR, revalidate 300s) resterait périmé jusqu'à
  // 5 minutes — trouvé en testant réellement le flux : un service créé via
  // l'admin n'apparaissait pas tout de suite sur la vitrine publique.
  if (corps.succes) revalidatePath("/services");
  return NextResponse.json(corps, { status: statut });
}
