"use client";

import { useEffect, useMemo, useState } from "react";
import { Bouton } from "@/components/Bouton";
import type { CategorieResume, ResultatSimulation, ServiceDetail } from "@/lib/types-catalogue";
import { formaterHTG } from "@/lib/types-catalogue";

const DELAI_DEBOUNCE_MS = 400;

type Etape = "configuration" | "coordonnees" | "confirmation";

export function ConfigurateurDevis({ categories }: { categories: CategorieResume[] }) {
  const servicesConfigurables = useMemo(
    () => categories.flatMap((c) => c.services.map((s) => ({ ...s, categorieNom: c.nom }))),
    [categories],
  );

  const [etape, setEtape] = useState<Etape>("configuration");
  const [slugChoisi, setSlugChoisi] = useState(servicesConfigurables[0]?.slug ?? "");
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [chargementService, setChargementService] = useState(false);

  const [quantite, setQuantite] = useState(1);
  const [largeurPouces, setLargeurPouces] = useState<number | "">("");
  const [hauteurPouces, setHauteurPouces] = useState<number | "">("");
  const [optionsChoisies, setOptionsChoisies] = useState<Record<string, string>>({});

  const [resultat, setResultat] = useState<ResultatSimulation | null>(null);
  const [erreurSimulation, setErreurSimulation] = useState<string | null>(null);
  const [enCalcul, setEnCalcul] = useState(false);

  const [coordonnees, setCoordonnees] = useState({ nomContact: "", emailContact: "", telContact: "", entreprise: "" });
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ numero: string; totalCents: string } | null>(null);

  // Charger le détail du service (attributs/options) à chaque changement de sélection.
  useEffect(() => {
    if (!slugChoisi) return;
    setChargementService(true);
    setService(null);
    setOptionsChoisies({});
    setResultat(null);
    fetch(`/api/catalogue/services/${slugChoisi}`)
      .then((r) => r.json())
      .then((corps) => setService(corps.succes ? corps.donnees : null))
      .finally(() => setChargementService(false));
  }, [slugChoisi]);

  // Simulation de prix en debounce — seule source de vérité, aucun calcul en JS ici (plan §4.4).
  useEffect(() => {
    if (!service || service.mode === "SUR_DEVIS") {
      setResultat(null);
      return;
    }
    if (service.mode === "SURFACE" && (!largeurPouces || !hauteurPouces)) {
      setResultat(null);
      return;
    }

    const identifiant = setTimeout(() => {
      setEnCalcul(true);
      setErreurSimulation(null);
      fetch("/api/devis/simuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: service.slug,
          quantite,
          largeurPouces: largeurPouces || undefined,
          hauteurPouces: hauteurPouces || undefined,
          optionsChoisies,
        }),
      })
        .then((r) => r.json())
        .then((corps) => {
          if (corps.succes) {
            setResultat(corps.donnees);
          } else {
            setResultat(null);
            setErreurSimulation(corps.erreur?.message ?? "Impossible de calculer le prix");
          }
        })
        .finally(() => setEnCalcul(false));
    }, DELAI_DEBOUNCE_MS);

    return () => clearTimeout(identifiant);
  }, [service, quantite, largeurPouces, hauteurPouces, optionsChoisies]);

  async function soumettreCommande() {
    if (!service) return;
    setEnvoiEnCours(true);
    setErreurEnvoi(null);
    try {
      const repCommande = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...coordonnees,
          modeLivraison: "RETRAIT_ATELIER",
          lignes: [
            {
              serviceSlug: service.slug,
              quantite,
              largeurPouces: largeurPouces || undefined,
              hauteurPouces: hauteurPouces || undefined,
              optionsChoisies,
            },
          ],
        }),
      }).then((r) => r.json());

      if (!repCommande.succes) {
        setErreurEnvoi(repCommande.erreur?.message ?? "Impossible de créer la commande");
        return;
      }

      const commande = repCommande.donnees;

      const repDevis = await fetch(`/api/commandes/${commande.id}/devis`, { method: "POST" }).then((r) => r.json());
      if (!repDevis.succes) {
        setErreurEnvoi(repDevis.erreur?.message ?? "Commande créée, mais le devis n'a pas pu être généré");
        return;
      }

      setConfirmation({ numero: repDevis.donnees.numero, totalCents: repDevis.donnees.totalCents });
      setEtape("confirmation");
    } catch {
      setErreurEnvoi("Erreur réseau — réessayez dans un instant");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  if (etape === "confirmation" && confirmation) {
    return (
      <div className="rounded-marque border border-marine-100 bg-white p-8 text-center sm:p-12">
        <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Devis envoyé</p>
        <h2 className="mt-2 text-3xl font-extrabold text-marine-500">{confirmation.numero}</h2>
        <p className="mt-4 text-lg text-marine-400">
          Total estimé : <span className="font-bold text-marine-500">{formaterHTG(confirmation.totalCents)}</span>
        </p>
        <p className="mt-2 text-sm text-marine-400">
          Un e-mail de confirmation a été envoyé à {coordonnees.emailContact || "votre adresse"}. Notre équipe vous
          recontacte pour la suite.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
      <div className="rounded-marque border border-marine-100 bg-white p-6 sm:p-8">
        {etape === "configuration" && (
          <>
            <label className="block text-sm font-bold text-marine-500">Service</label>
            <select
              value={slugChoisi}
              onChange={(e) => setSlugChoisi(e.target.value)}
              className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
            >
              {servicesConfigurables.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.categorieNom} — {s.nom}
                </option>
              ))}
            </select>

            {chargementService && <p className="mt-4 text-sm text-marine-400">Chargement…</p>}

            {service && service.mode === "SUR_DEVIS" && (
              <p className="mt-6 rounded-marque bg-creme-200 p-4 text-sm text-marine-500">
                Ce service se chiffre sur mesure : passez par le formulaire de{" "}
                <a href="/contact" className="font-bold underline">contact</a> plutôt que le devis instantané.
              </p>
            )}

            {service && service.mode !== "SUR_DEVIS" && (
              <div className="mt-6 space-y-5">
                {service.mode === "SURFACE" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-marine-500">Largeur (pouces)</label>
                      <input
                        type="number"
                        min={1}
                        value={largeurPouces}
                        onChange={(e) => setLargeurPouces(e.target.value ? Number(e.target.value) : "")}
                        className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-marine-500">Hauteur (pouces)</label>
                      <input
                        type="number"
                        min={1}
                        value={hauteurPouces}
                        onChange={(e) => setHauteurPouces(e.target.value ? Number(e.target.value) : "")}
                        className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-marine-500">Quantité</label>
                  <input
                    type="number"
                    min={service.quantiteMin}
                    max={service.quantiteMax ?? undefined}
                    value={quantite}
                    onChange={(e) => setQuantite(Math.max(service.quantiteMin, Number(e.target.value)))}
                    className="mt-2 w-32 rounded-marque border border-marine-100 px-4 py-3 text-sm"
                  />
                </div>

                {service.attributs.map((attribut) => (
                  <div key={attribut.id}>
                    <label className="block text-sm font-bold text-marine-500">
                      {attribut.libelle}
                      {attribut.obligatoire && <span className="text-magenta-500"> *</span>}
                    </label>
                    <select
                      value={optionsChoisies[attribut.cle] ?? ""}
                      onChange={(e) =>
                        setOptionsChoisies((o) => ({ ...o, [attribut.cle]: e.target.value }))
                      }
                      className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
                    >
                      <option value="">— Choisir —</option>
                      {attribut.options.map((o) => (
                        <option key={o.id} value={o.valeur}>
                          {o.libelle}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {erreurSimulation && <p className="text-sm text-magenta-600">{erreurSimulation}</p>}

                <Bouton
                  variante="secondaire"
                  taille="normal"
                  onClick={() => setEtape("coordonnees")}
                  disabled={!resultat}
                >
                  Continuer →
                </Bouton>
              </div>
            )}
          </>
        )}

        {etape === "coordonnees" && (
          <div className="space-y-4">
            <button type="button" onClick={() => setEtape("configuration")} className="text-sm font-bold text-marine-400">
              ← Retour
            </button>
            <div>
              <label className="block text-sm font-bold text-marine-500">Nom complet</label>
              <input
                value={coordonnees.nomContact}
                onChange={(e) => setCoordonnees((c) => ({ ...c, nomContact: e.target.value }))}
                className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-marine-500">E-mail</label>
              <input
                type="email"
                value={coordonnees.emailContact}
                onChange={(e) => setCoordonnees((c) => ({ ...c, emailContact: e.target.value }))}
                className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-marine-500">Téléphone</label>
              <input
                value={coordonnees.telContact}
                onChange={(e) => setCoordonnees((c) => ({ ...c, telContact: e.target.value }))}
                placeholder="+509 ..."
                className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-marine-500">Entreprise (optionnel)</label>
              <input
                value={coordonnees.entreprise}
                onChange={(e) => setCoordonnees((c) => ({ ...c, entreprise: e.target.value }))}
                className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
              />
            </div>

            {erreurEnvoi && <p className="text-sm text-magenta-600">{erreurEnvoi}</p>}

            <Bouton
              taille="normal"
              onClick={soumettreCommande}
              disabled={
                envoiEnCours || !coordonnees.nomContact || !coordonnees.emailContact || !coordonnees.telContact
              }
            >
              {envoiEnCours ? "Envoi…" : "Recevoir mon devis"}
            </Bouton>
          </div>
        )}
      </div>

      <div className="h-fit rounded-marque bg-marine-500 p-6 text-creme-100 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-lime">Estimation</p>
        {enCalcul && <p className="mt-4 text-sm text-marine-100">Calcul en cours…</p>}
        {!enCalcul && resultat && (
          <>
            <p className="mt-4 text-3xl font-extrabold text-white">{formaterHTG(resultat.totalCents)}</p>
            <ul className="mt-6 space-y-2 border-t border-marine-400/40 pt-4 text-xs text-marine-100">
              {resultat.etapes.map((e, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>{e.libelle}</span>
                  <span className="font-bold text-white">{e.valeur}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {!enCalcul && !resultat && (
          <p className="mt-4 text-sm text-marine-100">Complétez la configuration pour voir le prix.</p>
        )}
      </div>
    </div>
  );
}
