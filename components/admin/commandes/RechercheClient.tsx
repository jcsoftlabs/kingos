"use client";

import { useEffect, useRef, useState } from "react";

interface ClientTrouve {
  email: string;
  nom: string;
  entreprise: string | null;
  typeClient: string;
  telephone: string;
}

export function RechercheClient({ onSelectionner }: { onSelectionner: (client: ClientTrouve) => void }) {
  const [requete, setRequete] = useState("");
  const [resultats, setResultats] = useState<ClientTrouve[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (minuteur.current) clearTimeout(minuteur.current);
    if (requete.trim().length < 2) {
      setResultats([]);
      return;
    }
    minuteur.current = setTimeout(async () => {
      setEnCours(true);
      try {
        const reponse = await fetch(`/api/admin/clients?recherche=${encodeURIComponent(requete)}`);
        const corps = await reponse.json();
        setResultats(corps.succes && corps.donnees ? corps.donnees.slice(0, 8) : []);
        setOuvert(true);
      } finally {
        setEnCours(false);
      }
    }, 300);
    return () => {
      if (minuteur.current) clearTimeout(minuteur.current);
    };
  }, [requete]);

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-marine-500">Client existant (facultatif)</label>
      <input
        value={requete}
        onChange={(e) => setRequete(e.target.value)}
        onFocus={() => resultats.length > 0 && setOuvert(true)}
        onBlur={() => setTimeout(() => setOuvert(false), 150)}
        placeholder="Rechercher par nom, entreprise, e-mail ou téléphone…"
        className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
      />
      {enCours && <p className="mt-1 text-xs text-marine-300">Recherche…</p>}
      {ouvert && resultats.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-marque border border-marine-100 bg-white shadow-lg">
          {resultats.map((c) => (
            <li key={c.email}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelectionner(c);
                  setRequete("");
                  setResultats([]);
                  setOuvert(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-creme-100"
              >
                <span className="font-bold text-marine-500">{c.entreprise || c.nom}</span>
                {c.entreprise && <span className="text-marine-400"> — {c.nom}</span>}
                <div className="text-xs text-marine-400">
                  {c.email} · {c.telephone}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {ouvert && !enCours && requete.trim().length >= 2 && resultats.length === 0 && (
        <p className="mt-1 text-xs text-marine-400">Aucun client trouvé — remplissez le formulaire ci-dessous pour en créer un nouveau.</p>
      )}
    </div>
  );
}
