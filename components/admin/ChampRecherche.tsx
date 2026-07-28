"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ChampRecherche({ placeholder = "Rechercher…" }: { placeholder?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [valeur, setValeur] = useState(params.get("recherche") ?? "");

  function soumettre(e: React.FormEvent) {
    e.preventDefault();
    // La recherche vit dans l'URL : le résultat est partageable et le retour
    // arrière du navigateur fonctionne comme attendu.
    const suivant = new URLSearchParams();
    if (valeur.trim()) suivant.set("recherche", valeur.trim());
    router.push(`?${suivant.toString()}`);
  }

  return (
    <form onSubmit={soumettre} className="flex max-w-lg gap-2">
      <input
        type="search"
        value={valeur}
        onChange={(e) => setValeur(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-marque border border-marine-100 bg-white px-3 py-2 text-sm placeholder:text-marine-300"
      />
      <button
        type="submit"
        className="shrink-0 rounded-marque bg-marine-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-marine-600"
      >
        Rechercher
      </button>
    </form>
  );
}
