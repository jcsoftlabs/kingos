import { apiBackendFluxAuthentifie } from "@/lib/auth-serveur";

export async function GET() {
  const reponse = await apiBackendFluxAuthentifie("/api/admin/exports/paiements.csv");
  if (!reponse) return new Response("Authentification requise", { status: 401 });
  return new Response(reponse.body, {
    status: reponse.status,
    headers: {
      "Content-Type": reponse.headers.get("Content-Type") ?? "text/csv",
      "Content-Disposition": reponse.headers.get("Content-Disposition") ?? "attachment; filename=paiements.csv",
    },
  });
}
