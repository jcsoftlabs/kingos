"use client";

import { useState } from "react";

export function BoutonTelecharger({ ressourceId, format }: { ressourceId: string; format: string }) {
  const [enCours, setEnCours] = useState(false);

  async function telecharger() {
    setEnCours(true);
    try {
      const reponse = await fetch(`/api/ressources/${ressourceId}/telecharger?format=${encodeURIComponent(format)}`);
      const corps = await reponse.json();
      if (corps.succes && corps.donnees?.url) {
        window.location.href = corps.donnees.url;
      }
    } finally {
      setEnCours(false);
    }
  }

  return (
    <button
      type="button"
      onClick={telecharger}
      disabled={enCours}
      className="rounded-marque bg-marine-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-marine-600 disabled:opacity-50"
    >
      {enCours ? "…" : `.${format}`}
    </button>
  );
}
