"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconeDeconnexion } from "@/components/icones/admin";

export function BoutonDeconnexionAdmin() {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  async function deconnecter() {
    setEnCours(true);
    await fetch("/api/auth/deconnexion", { method: "POST" });
    router.refresh(); // le layout /admin redirige alors vers /admin/connexion
  }

  return (
    <button
      type="button"
      onClick={deconnecter}
      disabled={enCours}
      className="flex w-full items-center gap-3 rounded-marque px-3 py-2 text-sm font-semibold text-marine-100 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      <IconeDeconnexion className="h-[18px] w-[18px] shrink-0 text-marine-200" />
      {enCours ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
