import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

export async function POST(requete: Request) {
  const corpsClient = await requete.text();
  const { statut, corps } = await apiBackend("/api/auth/espace/code", { method: "POST", body: corpsClient, revalidate: false });
  return NextResponse.json(corps, { status: statut });
}
