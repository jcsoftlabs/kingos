import { NextResponse } from "next/server";
import { apiBackend } from "@/lib/api-backend";
import { effacerCookieSession, lireJetonSession } from "@/lib/session";

export async function POST() {
  const jeton = await lireJetonSession();
  if (jeton) {
    await apiBackend("/api/auth/deconnexion", { method: "POST", headers: { "X-Jeton-Session": jeton }, revalidate: false });
  }
  await effacerCookieSession();
  return NextResponse.json({ succes: true, donnees: null });
}
