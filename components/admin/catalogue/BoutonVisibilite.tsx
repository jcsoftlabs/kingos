"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BoutonVisibilite({ serviceId, visible }: { serviceId: string; visible: boolean }) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  async function basculer() {
    setEnCours(true);
    try {
      if (visible) {
        // "Masquer" = suppression douce (visible: false), pas de vrai DELETE.
        await fetch(`/api/admin/catalogue/services/${serviceId}`, { method: "DELETE" });
      } else {
        await fetch(`/api/admin/catalogue/services/${serviceId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visible: true }),
        });
      }
      router.refresh();
    } finally {
      setEnCours(false);
    }
  }

  return (
    <button
      type="button"
      onClick={basculer}
      disabled={enCours}
      className={`rounded-marque px-2.5 py-1 text-xs font-bold transition-colors disabled:opacity-50 ${
        visible ? "bg-foret-50 text-foret-600 hover:bg-foret-100" : "bg-creme-200 text-marine-400 hover:bg-creme-300"
      }`}
    >
      {enCours ? "…" : visible ? "Visible" : "Masqué"}
    </button>
  );
}
