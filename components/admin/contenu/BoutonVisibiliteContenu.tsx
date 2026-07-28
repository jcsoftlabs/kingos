"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  visible: boolean;
  champVisibilite: "visible" | "publiee";
  base: "realisations" | "ressources";
}

export function BoutonVisibiliteContenu({ id, visible, champVisibilite, base }: Props) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  async function basculer() {
    setEnCours(true);
    try {
      if (visible) {
        await fetch(`/api/admin/${base}/${id}`, { method: "DELETE" });
      } else {
        await fetch(`/api/admin/${base}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [champVisibilite]: true }),
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
