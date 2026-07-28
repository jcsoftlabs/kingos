"use client";

export function BoutonImprimer() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-marque bg-marine-500 px-4 py-2 text-sm font-bold text-white print:hidden"
    >
      Imprimer le reçu
    </button>
  );
}
