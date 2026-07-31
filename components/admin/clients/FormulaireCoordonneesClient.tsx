"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";

const LIBELLES_TYPE_CLIENT: Record<string, string> = {
  PARTICULIER: "Particulier",
  ENTREPRISE: "Entreprise",
  ONG: "ONG",
  INSTITUTION_ETATIQUE: "Institution étatique",
};

interface Props {
  email: string;
  nom: string;
  entreprise: string | null;
  typeClient: string;
  telephone: string;
  adresseLivraison: string | null;
  compte: { creeLe: string; derniereConnexion: string | null } | null;
}

export function FormulaireCoordonneesClient({ email, nom, entreprise, typeClient, telephone, adresseLivraison, compte }: Props) {
  const router = useRouter();
  const [edition, setEdition] = useState(false);
  const [valeurs, setValeurs] = useState({
    nomContact: nom,
    entreprise: entreprise ?? "",
    typeClient,
    telContact: telephone,
    adresseLivraison: adresseLivraison ?? "",
  });
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch(`/api/admin/clients/${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomContact: valeurs.nomContact,
          entreprise: valeurs.entreprise || null,
          typeClient: valeurs.typeClient,
          telContact: valeurs.telContact,
          adresseLivraison: valeurs.adresseLivraison || null,
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Enregistrement impossible");
        return;
      }
      setEdition(false);
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  if (!edition) {
    return (
      <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-marine-500">Coordonnées</h2>
          <button type="button" onClick={() => setEdition(true)} className="text-xs font-bold text-magenta-500 hover:underline">
            Modifier
          </button>
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          <div>
            <dt className="text-xs text-marine-400">E-mail</dt>
            <dd className="font-medium text-marine-500">{email}</dd>
          </div>
          <div>
            <dt className="text-xs text-marine-400">Téléphone</dt>
            <dd className="font-medium text-marine-500">{telephone || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-marine-400">Adresse de livraison</dt>
            <dd className="font-medium text-marine-500">{adresseLivraison || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-marine-400">Compte en ligne</dt>
            <dd className="font-medium text-marine-500">
              {compte ? (
                <>
                  Oui — créé le {new Date(compte.creeLe).toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" })}
                  <div className="text-xs font-normal text-marine-400">
                    {compte.derniereConnexion
                      ? `dernière connexion ${new Date(compte.derniereConnexion).toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" })}`
                      : "jamais connecté"}
                  </div>
                </>
              ) : (
                <span className="text-marine-400">Non — commandes passées sans inscription</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <form onSubmit={enregistrer} className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-marine-500">Modifier les coordonnées</h2>
      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-xs font-bold text-marine-500">Type de client</label>
          <select
            value={valeurs.typeClient}
            onChange={(e) => setValeurs((v) => ({ ...v, typeClient: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          >
            {Object.entries(LIBELLES_TYPE_CLIENT).map(([valeur, libelle]) => (
              <option key={valeur} value={valeur}>
                {libelle}
              </option>
            ))}
          </select>
        </div>
        {valeurs.typeClient !== "PARTICULIER" && (
          <div>
            <label className="block text-xs font-bold text-marine-500">Raison sociale</label>
            <input
              value={valeurs.entreprise}
              onChange={(e) => setValeurs((v) => ({ ...v, entreprise: e.target.value }))}
              className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-bold text-marine-500">Nom du contact</label>
          <input
            required
            value={valeurs.nomContact}
            onChange={(e) => setValeurs((v) => ({ ...v, nomContact: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Téléphone</label>
          <input
            required
            value={valeurs.telContact}
            onChange={(e) => setValeurs((v) => ({ ...v, telContact: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-marine-500">Adresse de livraison</label>
          <input
            value={valeurs.adresseLivraison}
            onChange={(e) => setValeurs((v) => ({ ...v, adresseLivraison: e.target.value }))}
            className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {erreur && <p className="mt-2 text-sm text-magenta-600">{erreur}</p>}

      <div className="mt-4 flex gap-2">
        <Bouton taille="petit" disabled={enCours}>
          {enCours ? "…" : "Enregistrer"}
        </Bouton>
        <button type="button" onClick={() => setEdition(false)} className="text-xs text-marine-400">
          Annuler
        </button>
      </div>
    </form>
  );
}
