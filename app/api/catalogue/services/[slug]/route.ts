import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";

export async function GET(_requete: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { statut, corps } = await apiBackend(`/api/catalogue/services/${slug}`, { revalidate: 300 });
  return NextResponse.json(corps, { status: statut });
}
