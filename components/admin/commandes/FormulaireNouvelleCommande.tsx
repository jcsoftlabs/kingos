"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bouton } from "@/components/Bouton";
import { RechercheClient } from "./RechercheClient";

interface Option {
  id: string;
  valeur: string;
  libelle: string;
}
interface Attribut {
  id: string;
  cle: string;
  libelle: string;
  type: string;
  obligatoire: boolean;
  options: Option[];
}
interface Service {
  id: string;
  slug: string;
  nom: string;
  mode: string;
  attributs: Attribut[];
}
interface Categorie {
  id: string;
  nom: string;
  services: Service[];
}

interface LigneFormulaire {
  serviceSlug: string;
  quantite: number;
  largeurPouces: string;
  hauteurPouces: string;
  optionsChoisies: Record<string, string>;
}

function ligneVide(): LigneFormulaire {
  return { serviceSlug: "", quantite: 1, largeurPouces: "", hauteurPouces: "", optionsChoisies: {} };
}

export function FormulaireNouvelleCommande({ categories }: { categories: Categorie[] }) {
  const router = useRouter();
  const services = categories.flatMap((c) => c.services);

  const [nomContact, setNomContact] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [telContact, setTelContact] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [typeClient, setTypeClient] = useState("PARTICULIER");
  const [lignes, setLignes] = useState<LigneFormulaire[]>([ligneVide()]);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  function majLigne(index: number, patch: Partial<LigneFormulaire>) {
    setLignes((l) => l.map((ligne, i) => (i === index ? { ...ligne, ...patch } : ligne)));
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponseCommande = await fetch("/api/admin/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomContact,
          emailContact,
          telContact,
          entreprise: entreprise || undefined,
          typeClient,
          lignes: lignes.map((l) => ({
            serviceSlug: l.serviceSlug,
            quantite: l.quantite,
            largeurPouces: l.largeurPouces ? Number(l.largeurPouces) : undefined,
            hauteurPouces: l.hauteurPouces ? Number(l.hauteurPouces) : undefined,
            optionsChoisies: l.optionsChoisies,
          })),
        }),
      });
      const corpsCommande = await reponseCommande.json();
      if (!corpsCommande.succes) {
        setErreur(corpsCommande.erreur?.message ?? "Impossible de créer la commande");
        return;
      }
      router.push(`/admin/commandes/${corpsCommande.donnees.numero}`);
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form onSubmit={soumettre} className="space-y-6">
      <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-marine-500">Client</h2>

        <div className="mt-3">
          <RechercheClient
            onSelectionner={(client) => {
              setNomContact(client.nom);
              setEmailContact(client.email);
              setTelContact(client.telephone);
              setEntreprise(client.entreprise ?? "");
              setTypeClient(client.typeClient);
            }}
          />
        </div>

        <div className="mt-4 grid gap-4 border-t border-marine-100 pt-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-marine-500">Type de client</label>
            <select value={typeClient} onChange={(e) => setTypeClient(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm">
              <option value="PARTICULIER">Particulier</option>
              <option value="ENTREPRISE">Entreprise</option>
              <option value="ONG">ONG</option>
              <option value="INSTITUTION_ETATIQUE">Institution étatique</option>
            </select>
          </div>
          {typeClient !== "PARTICULIER" && (
            <div>
              <label className="block text-xs font-bold text-marine-500">Raison sociale</label>
              <input value={entreprise} onChange={(e) => setEntreprise(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-marine-500">Nom du contact</label>
            <input required value={nomContact} onChange={(e) => setNomContact(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-marine-500">Téléphone</label>
            <input required value={telContact} onChange={(e) => setTelContact(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-marine-500">E-mail</label>
            <input required type="email" value={emailContact} onChange={(e) => setEmailContact(e.target.value)} className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-marine-500">Lignes</h2>
          <button type="button" onClick={() => setLignes((l) => [...l, ligneVide()])} className="text-xs font-bold text-magenta-500 hover:underline">
            + Ajouter une ligne
          </button>
        </div>
        <p className="mt-1 text-xs text-marine-400">
          Seuls les services du catalogue sont proposés ici. Pour un travail ponctuel non catalogué (photocopies,
          plastification…), utilisez plutôt <em>Vente rapide</em>.
        </p>

        <div className="mt-4 space-y-4">
          {lignes.map((ligne, i) => {
            const service = services.find((s) => s.slug === ligne.serviceSlug);
            return (
              <div key={i} className="rounded-marque border border-marine-100 bg-creme-100 p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="block text-xs font-bold text-marine-500">Service</label>
                    <select
                      required
                      value={ligne.serviceSlug}
                      onChange={(e) => majLigne(i, { serviceSlug: e.target.value, optionsChoisies: {} })}
                      className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm"
                    >
                      <option value="">— Choisir —</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.slug}>
                          {s.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-marine-500">Quantité</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={ligne.quantite}
                      onChange={(e) => majLigne(i, { quantite: Number(e.target.value) })}
                      className="mt-1 w-24 rounded-marque border border-marine-100 px-3 py-2 text-sm"
                    />
                  </div>
                  {service?.mode === "SURFACE" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-marine-500">Largeur (po)</label>
                        <input
                          type="number"
                          required
                          value={ligne.largeurPouces}
                          onChange={(e) => majLigne(i, { largeurPouces: e.target.value })}
                          className="mt-1 w-24 rounded-marque border border-marine-100 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-marine-500">Hauteur (po)</label>
                        <input
                          type="number"
                          required
                          value={ligne.hauteurPouces}
                          onChange={(e) => majLigne(i, { hauteurPouces: e.target.value })}
                          className="mt-1 w-24 rounded-marque border border-marine-100 px-3 py-2 text-sm"
                        />
                      </div>
                    </>
                  )}
                  {lignes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setLignes((l) => l.filter((_, idx) => idx !== i))}
                      className="text-xs font-bold text-magenta-600 hover:underline"
                    >
                      Retirer
                    </button>
                  )}
                </div>

                {service?.attributs.filter((a) => a.type === "CHOIX").map((attr) => (
                  <div key={attr.id} className="mt-3">
                    <label className="block text-xs font-bold text-marine-500">
                      {attr.libelle}
                      {attr.obligatoire && " *"}
                    </label>
                    <select
                      required={attr.obligatoire}
                      value={ligne.optionsChoisies[attr.cle] ?? ""}
                      onChange={(e) => majLigne(i, { optionsChoisies: { ...ligne.optionsChoisies, [attr.cle]: e.target.value } })}
                      className="mt-1 rounded-marque border border-marine-100 px-3 py-2 text-sm"
                    >
                      <option value="">— Choisir —</option>
                      {attr.options.map((o) => (
                        <option key={o.id} value={o.valeur}>
                          {o.libelle}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {erreur && <p className="text-sm text-magenta-600">{erreur}</p>}

      <Bouton disabled={enCours}>{enCours ? "Création…" : "Créer la commande"}</Bouton>
    </form>
  );
}
