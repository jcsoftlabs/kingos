import { NextResponse } from "next/server";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";

export async function GET() {
  const { statut, corps } = await apiBackendAuthentifie("/api/admin/support/conversations");
  return NextResponse.json(corps, { status: statut });
}
