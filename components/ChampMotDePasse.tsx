"use client";

import { useId, useState } from "react";
import { IconeOeil, IconeOeilBarre } from "@/components/icones";

interface Props {
  value: string;
  onChange: (valeur: string) => void;
  label?: string;
  required?: boolean;
  autoComplete?: string;
}

export function ChampMotDePasse({ value, onChange, label = "Mot de passe", required, autoComplete }: Props) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-marine-500">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-marque border border-marine-100 px-4 py-3 pr-11 text-sm"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-marine-300 hover:text-marine-500"
        >
          {visible ? <IconeOeilBarre className="h-5 w-5" /> : <IconeOeil className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
