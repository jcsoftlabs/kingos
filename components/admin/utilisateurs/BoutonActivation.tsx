"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BoutonActivation({ utilisateurId, actif }: { utilisateurId: string; actif: boolean }) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  async function basculer() {
    setEnCours(true);
    try {
      await fetch(`/api/admin/utilisateurs/${utilisateurId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actif: !actif }),
      });
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
        actif ? "bg-creme-200 text-magenta-600 hover:bg-magenta-50" : "bg-foret-50 text-foret-600 hover:bg-foret-100"
      }`}
    >
      {enCours ? "…" : actif ? "Désactiver" : "Réactiver"}
    </button>
  );
}
