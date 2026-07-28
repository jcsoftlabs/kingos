"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formaterHTG } from "@/lib/types-catalogue";

interface Option {
  id: string;
  valeur: string;
  libelle: string;
  coefficient: string | null;
  supplementCents: string | null;
}
interface Attribut {
  id: string;
  cle: string;
  libelle: string;
  type: string;
  obligatoire: boolean;
  options: Option[];
}

const TYPES = [
  { valeur: "CHOIX", libelle: "Choix (liste d'options)" },
  { valeur: "DIMENSION", libelle: "Dimension" },
  { valeur: "NOMBRE", libelle: "Nombre" },
  { valeur: "BOOLEEN", libelle: "Oui / Non" },
  { valeur: "TEXTE", libelle: "Texte libre" },
];

function FormulaireOption({ attributId }: { attributId: string }) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [valeur, setValeur] = useState("");
  const [libelle, setLibelle] = useState("");
  const [coefficient, setCoefficient] = useState("1");
  const [enCours, setEnCours] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    try {
      await fetch(`/api/admin/catalogue/attributs/${attributId}/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valeur, libelle, coefficient: coefficient ? Number(coefficient) : undefined }),
      });
      setValeur("");
      setLibelle("");
      setOuvert(false);
      router.refresh();
    } finally {
      setEnCours(false);
    }
  }

  if (!ouvert) {
    return (
      <button type="button" onClick={() => setOuvert(true)} className="text-xs font-bold text-magenta-500 hover:underline">
        + Option
      </button>
    );
  }

  return (
    <form onSubmit={soumettre} className="flex flex-wrap items-end gap-2 rounded-marque bg-creme-100 p-2">
      <input required placeholder="valeur (slug)" value={valeur} onChange={(e) => setValeur(e.target.value)} className="w-28 rounded-marque border border-marine-100 px-2 py-1 text-xs" />
      <input required placeholder="libellé" value={libelle} onChange={(e) => setLibelle(e.target.value)} className="w-28 rounded-marque border border-marine-100 px-2 py-1 text-xs" />
      <input
        placeholder="coeff."
        type="number"
        step="0.01"
        value={coefficient}
        onChange={(e) => setCoefficient(e.target.value)}
        className="w-16 rounded-marque border border-marine-100 px-2 py-1 text-xs"
      />
      <button type="submit" disabled={enCours} className="text-xs font-bold text-magenta-500">
        {enCours ? "…" : "Ajouter"}
      </button>
      <button type="button" onClick={() => setOuvert(false)} className="text-xs text-marine-400">
        Annuler
      </button>
    </form>
  );
}

function FormulaireAttribut({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [cle, setCle] = useState("");
  const [libelle, setLibelle] = useState("");
  const [type, setType] = useState("CHOIX");
  const [obligatoire, setObligatoire] = useState(true);
  const [enCours, setEnCours] = useState(false);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    try {
      await fetch(`/api/admin/catalogue/services/${serviceId}/attributs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cle, libelle, type, obligatoire }),
      });
      setCle("");
      setLibelle("");
      setOuvert(false);
      router.refresh();
    } finally {
      setEnCours(false);
    }
  }

  if (!ouvert) {
    return (
      <button type="button" onClick={() => setOuvert(true)} className="text-xs font-bold text-magenta-500 hover:underline">
        + Nouvel attribut
      </button>
    );
  }

  return (
    <form onSubmit={soumettre} className="mt-2 flex flex-wrap items-end gap-2 rounded-marque border border-marine-100 bg-white p-3">
      <div>
        <label className="block text-[10px] font-bold text-marine-500">Clé (identifiant)</label>
        <input required placeholder="ex : materiau" value={cle} onChange={(e) => setCle(e.target.value)} className="mt-0.5 w-32 rounded-marque border border-marine-100 px-2 py-1.5 text-xs" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-marine-500">Libellé</label>
        <input required placeholder="ex : Matériau" value={libelle} onChange={(e) => setLibelle(e.target.value)} className="mt-0.5 w-32 rounded-marque border border-marine-100 px-2 py-1.5 text-xs" />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-marine-500">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-0.5 rounded-marque border border-marine-100 px-2 py-1.5 text-xs">
          {TYPES.map((t) => (
            <option key={t.valeur} value={t.valeur}>
              {t.libelle}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-1.5 text-xs text-marine-500">
        <input type="checkbox" checked={obligatoire} onChange={(e) => setObligatoire(e.target.checked)} />
        Obligatoire
      </label>
      <button type="submit" disabled={enCours} className="text-xs font-bold text-magenta-500">
        {enCours ? "…" : "Créer"}
      </button>
      <button type="button" onClick={() => setOuvert(false)} className="text-xs text-marine-400">
        Annuler
      </button>
    </form>
  );
}

export function GestionAttributs({ serviceId, attributs }: { serviceId: string; attributs: Attribut[] }) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setOuvert((v) => !v)} className="text-xs font-bold text-marine-400 hover:text-magenta-500 hover:underline">
        {attributs.length} attribut{attributs.length !== 1 ? "s" : ""} {ouvert ? "▲" : "▼"}
      </button>

      {ouvert && (
        <div className="mt-2 space-y-3 rounded-marque bg-creme-100 p-3">
          {attributs.map((attr) => (
            <div key={attr.id} className="rounded-marque border border-marine-100 bg-white p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-marine-500">{attr.libelle}</span>
                <span className="rounded bg-creme-200 px-1.5 py-0.5 text-[10px] font-bold text-marine-400">{attr.type}</span>
                {attr.obligatoire && <span className="text-[10px] font-bold text-magenta-500">obligatoire</span>}
              </div>
              {attr.type === "CHOIX" && (
                <div className="mt-2 space-y-1">
                  {attr.options.map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-xs text-marine-400">
                      <span>{o.libelle}</span>
                      <span>
                        {o.coefficient && Number(o.coefficient) !== 1 && `×${o.coefficient}`}
                        {o.supplementCents && Number(o.supplementCents) > 0 && ` +${formaterHTG(o.supplementCents)}`}
                      </span>
                    </div>
                  ))}
                  <FormulaireOption attributId={attr.id} />
                </div>
              )}
            </div>
          ))}
          <FormulaireAttribut serviceId={serviceId} />
        </div>
      )}
    </div>
  );
}
