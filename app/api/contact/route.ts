import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

export async function POST(requete: Request) {
  const corpsClient = await requete.json();
  const { statut, corps } = await apiBackend("/api/contact", {
    method: "POST",
    body: JSON.stringify(corpsClient),
    revalidate: false,
  });
  return NextResponse.json(corps, { status: statut });
}
