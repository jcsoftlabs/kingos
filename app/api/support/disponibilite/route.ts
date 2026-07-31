import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

export async function GET() {
  const { statut, corps } = await apiBackend("/api/support/disponibilite", { revalidate: false });
  return NextResponse.json(corps, { status: statut });
}
