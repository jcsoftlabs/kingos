"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";
import type { ParametresEntreprise } from "@/app/admin/(protege)/parametres/page";

interface Banque {
  banque: string;
  titulaire: string;
  numeroCompte: string;
  type?: string;
}

function ChampTexte({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-marine-500">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm disabled:bg-creme-100 disabled:text-marine-400"
      />
    </div>
  );
}

export function FormulaireParametres({ parametres, lectureSeule }: { parametres: ParametresEntreprise; lectureSeule: boolean }) {
  const router = useRouter();
  const [raisonSociale, setRaisonSociale] = useState(parametres.raisonSociale);
  const [adresse, setAdresse] = useState(parametres.adresse);
  const [ville, setVille] = useState(parametres.ville);
  const [telephone, setTelephone] = useState(parametres.telephone);
  const [email, setEmail] = useState(parametres.email);
  const [siteWeb, setSiteWeb] = useState(parametres.siteWeb ?? "");
  const [nif, setNif] = useState(parametres.nif ?? "");
  const [moncashNumero, setMoncashNumero] = useState(parametres.moncashNumero ?? "");
  const [natcashNumero, setNatcashNumero] = useState(parametres.natcashNumero ?? "");
  const [tauxTaxePct, setTauxTaxePct] = useState(parametres.tauxTaxePct);
  const [tauxChangeUSD, setTauxChangeUSD] = useState(parametres.tauxChangeUSD ?? "");
  const [conditionsDevis, setConditionsDevis] = useState(parametres.conditionsDevis);
  const [conditionsFacture, setConditionsFacture] = useState(parametres.conditionsFacture);
  const [banques, setBanques] = useState<Banque[]>(parametres.banques ?? []);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  function majBanque(index: number, champ: keyof Banque, valeur: string) {
    setBanques((b) => b.map((banque, i) => (i === index ? { ...banque, [champ]: valeur } : banque)));
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    setSucces(false);
    try {
      const reponse = await fetch("/api/admin/parametres", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raisonSociale,
          adresse,
          ville,
          telephone,
          email,
          siteWeb: siteWeb || null,
          nif: nif || null,
          moncashNumero: moncashNumero || null,
          natcashNumero: natcashNumero || null,
          tauxTaxePct: Number(tauxTaxePct),
          tauxChangeUSD: tauxChangeUSD ? Number(tauxChangeUSD) : null,
          conditionsDevis,
          conditionsFacture,
          banques: banques.filter((b) => b.banque && b.numeroCompte),
        }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Impossible d'enregistrer");
        return;
      }
      setSucces(true);
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="space-y-6">
      {lectureSeule && (
        <p className="rounded-marque bg-creme-200 px-4 py-3 text-sm text-marine-400">
          Lecture seule pour votre rôle — seul un administrateur peut modifier ces paramètres.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ChampTexte label="Raison sociale" value={raisonSociale} onChange={setRaisonSociale} disabled={lectureSeule} />
        <ChampTexte label="NIF" value={nif} onChange={setNif} disabled={lectureSeule} />
        <ChampTexte label="Adresse" value={adresse} onChange={setAdresse} disabled={lectureSeule} />
        <ChampTexte label="Ville" value={ville} onChange={setVille} disabled={lectureSeule} />
        <ChampTexte label="Téléphone" value={telephone} onChange={setTelephone} disabled={lectureSeule} />
        <ChampTexte label="E-mail" type="email" value={email} onChange={setEmail} disabled={lectureSeule} />
        <ChampTexte label="Site web" value={siteWeb} onChange={setSiteWeb} disabled={lectureSeule} />
        <ChampTexte label="Taux de taxe (%)" type="number" value={tauxTaxePct} onChange={setTauxTaxePct} disabled={lectureSeule} />
        <ChampTexte
          label="Taux de change (HTG pour 1 USD)"
          type="number"
          value={tauxChangeUSD}
          onChange={setTauxChangeUSD}
          disabled={lectureSeule}
        />
        <ChampTexte label="Numéro MonCash" value={moncashNumero} onChange={setMoncashNumero} disabled={lectureSeule} />
        <ChampTexte label="Numéro NatCash" value={natcashNumero} onChange={setNatcashNumero} disabled={lectureSeule} />
      </div>
      <p className="-mt-3 text-xs text-marine-400">
        Le taux de change détermine l&apos;équivalent en dollars affiché sur les devis et factures, en plus du
        montant en gourdes. Laissez vide pour n&apos;afficher que les gourdes.
      </p>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-marine-500">Comptes bancaires</label>
          {!lectureSeule && (
            <button
              type="button"
              onClick={() => setBanques((b) => [...b, { banque: "", titulaire: raisonSociale, numeroCompte: "" }])}
              className="text-xs font-bold text-magenta-500 hover:underline"
            >
              + Ajouter
            </button>
          )}
        </div>
        <div className="mt-2 space-y-2">
          {banques.length === 0 && <p className="text-sm text-marine-400">Aucun compte bancaire renseigné.</p>}
          {banques.map((banque, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2 rounded-marque border border-marine-100 bg-creme-100 p-3">
              <input
                placeholder="Banque"
                value={banque.banque}
                disabled={lectureSeule}
                onChange={(e) => majBanque(i, "banque", e.target.value)}
                className="rounded-marque border border-marine-100 px-2 py-1.5 text-sm disabled:bg-creme-100"
              />
              <input
                placeholder="Titulaire"
                value={banque.titulaire}
                disabled={lectureSeule}
                onChange={(e) => majBanque(i, "titulaire", e.target.value)}
                className="rounded-marque border border-marine-100 px-2 py-1.5 text-sm disabled:bg-creme-100"
              />
              <input
                placeholder="N° de compte"
                value={banque.numeroCompte}
                disabled={lectureSeule}
                onChange={(e) => majBanque(i, "numeroCompte", e.target.value)}
                className="rounded-marque border border-marine-100 px-2 py-1.5 text-sm disabled:bg-creme-100"
              />
              {!lectureSeule && (
                <button
                  type="button"
                  onClick={() => setBanques((b) => b.filter((_, idx) => idx !== i))}
                  className="text-xs font-bold text-magenta-600 hover:underline"
                >
                  Retirer
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-marine-500">Conditions — devis</label>
        <textarea
          value={conditionsDevis}
          disabled={lectureSeule}
          onChange={(e) => setConditionsDevis(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm disabled:bg-creme-100"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-marine-500">Conditions — facture</label>
        <textarea
          value={conditionsFacture}
          disabled={lectureSeule}
          onChange={(e) => setConditionsFacture(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm disabled:bg-creme-100"
        />
      </div>

      {erreur && <p className="text-sm text-magenta-600">{erreur}</p>}
      {succes && <p className="text-sm text-foret-600">Paramètres enregistrés.</p>}

      {!lectureSeule && (
        <Bouton taille="normal" disabled={enCours}>
          {enCours ? "Enregistrement…" : "Enregistrer"}
        </Bouton>
      )}
    </form>
  );
}
