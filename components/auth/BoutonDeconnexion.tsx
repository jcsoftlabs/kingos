"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bouton } from "@/components/Bouton";

export function BoutonDeconnexion({ variante = "contour" }: { variante?: "contour" | "contourClair" }) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  async function deconnecter() {
    setEnCours(true);
    await fetch("/api/auth/deconnexion", { method: "POST" });
    router.refresh();
  }

  return (
    <Bouton variante={variante} taille="petit" onClick={deconnecter} disabled={enCours}>
      {enCours ? "…" : "Se déconnecter"}
    </Bouton>
  );
}
