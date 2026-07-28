"use client";

import { useState } from "react";

export function BoutonPdf({ type, numero }: { type: "devis" | "factures"; numero: string }) {
  const [enCours, setEnCours] = useState(false);

  async function ouvrir() {
    setEnCours(true);
    try {
      const reponse = await fetch(`/api/${type}/${numero}/pdf`);
      const corps = await reponse.json();
      if (corps.succes && corps.donnees?.url) {
        window.open(corps.donnees.url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setEnCours(false);
    }
  }

  return (
    <button
      type="button"
      onClick={ouvrir}
      disabled={enCours}
      className="rounded-marque bg-marine-50 px-2.5 py-1 text-xs font-bold text-marine-500 transition-colors hover:bg-marine-100 disabled:opacity-50"
    >
      {enCours ? "…" : "PDF"}
    </button>
  );
}
