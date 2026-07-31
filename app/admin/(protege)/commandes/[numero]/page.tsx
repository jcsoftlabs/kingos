import Link from "next/link";
import { notFound } from "next/navigation";
import { apiBackendAuthentifie, obtenirUtilisateurCourant } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { EntetePage } from "@/components/admin/EntetePage";
import { BadgeStatut } from "@/components/admin/BadgeStatut";
import { ActionsCommande } from "@/components/admin/commandes/ActionsCommande";
import { FormulairePaiement } from "@/components/admin/commandes/FormulairePaiement";
import { EcheanceFacture } from "@/components/admin/commandes/EcheanceFacture";
import { DropzoneFichiers } from "@/components/admin/commandes/DropzoneFichiers";

interface Ligne {
  id: string;
  serviceNom: string;
  quantite: number;
  totalCents?: string;
}
interface Evenement {
  id: string;
  type: string;
  message: string;
  creeLe: string;
  ancienStatut: string | null;
  nouveauStatut: string | null;
}
interface Fichier {
  id: string;
  nomOriginal: string;
  extension: string;
  tailleOctets: string;
  statut: string;
  creeLe: string;
}
interface DevisResume {
  id: string;
  numero: string;
  statut: string;
  totalCents?: string;
}
interface FactureResume {
  id: string;
  numero: string;
  statut: string;
  totalCents?: string;
  payeCents?: string;
  echeanceLe: string | null;
}

interface Commande {
  id: string;
  numero: string;
  statut: string;
  emailContact: string;
  nomContact: string;
  telContact: string;
  entreprise: string | null;
  typeClient: string;
  modeLivraison: string;
  adresseLivraison: string | null;
  totalCents?: string;
  creeLe: string;
  lignes: Ligne[];
  evenements: Evenement[];
  fichiers: Fichier[];
  devis: DevisResume[];
  factures: FactureResume[];
}

const LIBELLES_TYPE_CLIENT: Record<string, string> = {
  PARTICULIER: "Particulier",
  ENTREPRISE: "Entreprise",
  ONG: "ONG",
  INSTITUTION_ETATIQUE: "Institution étatique",
};

const ROLES_COMMERCIAUX = ["SUPER_ADMIN", "ADMIN", "COMMERCIAL"];

export async function generateMetadata({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  return { title: `${numero} — Commandes` };
}

export default async function PageCommandeDetail({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const [{ corps }, utilisateur, { corps: corpsParametres }] = await Promise.all([
    apiBackendAuthentifie<Commande>(`/api/commandes/${numero}`),
    obtenirUtilisateurCourant(),
    // Sert au formulaire de paiement : sans taux configuré, l'encaissement en
    // dollars n'est simplement pas proposé.
    apiBackendAuthentifie<{ tauxChangeUSD: string | null }>("/api/admin/parametres"),
  ]);
  const tauxChangeUSD =
    corpsParametres.succes && corpsParametres.donnees?.tauxChangeUSD ? Number(corpsParametres.donnees.tauxChangeUSD) : null;
  if (!corps.succes || !corps.donnees) notFound();
  const commande = corps.donnees;
  const peutAgirCommercial = !!utilisateur && ROLES_COMMERCIAUX.includes(utilisateur.role);

  const factureOuverte = commande.factures.find((f) => f.statut !== "PAYEE" && f.statut !== "ANNULEE");

  return (
    <>
      <Link href="/admin/commandes" className="text-xs font-bold text-marine-400 hover:text-magenta-500">
        ← Toutes les commandes
      </Link>

      <EntetePage
        titre={commande.numero}
        description={`Créée le ${new Date(commande.creeLe).toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" })}`}
      >
        <BadgeStatut statut={commande.statut} />
      </EntetePage>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {peutAgirCommercial && (
            <ActionsCommande
              commandeId={commande.id}
              statut={commande.statut}
              devis={commande.devis}
              factures={commande.factures}
              peutAgirCommercial={peutAgirCommercial}
            />
          )}

          <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
            <div className="border-b border-marine-100 px-5 py-4">
              <h2 className="text-sm font-bold text-marine-500">Lignes</h2>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-marine-100">
                {commande.lignes.map((l) => (
                  <tr key={l.id}>
                    <td className="px-5 py-3 text-marine-500">{l.serviceNom}</td>
                    <td className="px-5 py-3 text-right text-marine-400">× {l.quantite}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
                      {l.totalCents !== undefined ? formaterHTG(l.totalCents) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              {commande.totalCents !== undefined && (
                <tfoot>
                  <tr className="border-t border-marine-100">
                    <td colSpan={2} className="px-5 py-3 text-right text-xs font-bold uppercase text-marine-400">
                      Total
                    </td>
                    <td className="px-5 py-3 text-right font-extrabold tabular-nums text-marine-500">
                      {formaterHTG(commande.totalCents)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {(commande.devis.length > 0 || commande.factures.length > 0) && (
            <div className="grid gap-5 sm:grid-cols-2">
              {commande.devis.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
                  <div className="border-b border-marine-100 px-5 py-4">
                    <h2 className="text-sm font-bold text-marine-500">Devis</h2>
                  </div>
                  <ul className="divide-y divide-marine-100">
                    {commande.devis.map((d) => (
                      <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                        <span className="flex-1 font-bold text-marine-500">{d.numero}</span>
                        <BadgeStatut statut={d.statut} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {commande.factures.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
                  <div className="border-b border-marine-100 px-5 py-4">
                    <h2 className="text-sm font-bold text-marine-500">Factures</h2>
                  </div>
                  <ul className="divide-y divide-marine-100">
                    {commande.factures.map((f) => (
                      <li key={f.id} className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Link href={`/admin/factures/${f.numero}/recu`} className="flex-1 font-bold text-marine-500 hover:text-magenta-500 hover:underline">
                            {f.numero}
                          </Link>
                          <BadgeStatut statut={f.statut} />
                        </div>
                        {peutAgirCommercial && (
                          <div className="mt-1.5">
                            <EcheanceFacture factureId={f.id} echeanceLe={f.echeanceLe} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {peutAgirCommercial && factureOuverte && factureOuverte.totalCents !== undefined && factureOuverte.payeCents !== undefined && (
            <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-marine-500">Paiement</h2>
              <p className="mt-1 text-xs text-marine-400">
                Facture {factureOuverte.numero} — {formaterHTG(factureOuverte.payeCents)} réglé sur {formaterHTG(factureOuverte.totalCents)}
              </p>
              <div className="mt-3">
                <FormulairePaiement
                  factureId={factureOuverte.id}
                  soldeRestantCents={(BigInt(factureOuverte.totalCents) - BigInt(factureOuverte.payeCents)).toString()}
                  tauxChangeUSD={tauxChangeUSD}
                />
              </div>
            </div>
          )}

          <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-marine-500">Fichiers</h2>
            <div className="mt-3">
              <DropzoneFichiers commandeId={commande.id} fichiers={commande.fichiers} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-marine-500">Client</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs text-marine-400">Type</dt>
                <dd className="font-medium text-marine-500">{LIBELLES_TYPE_CLIENT[commande.typeClient] ?? commande.typeClient}</dd>
              </div>
              <div>
                <dt className="text-xs text-marine-400">Nom</dt>
                <dd className="font-medium text-marine-500">{commande.entreprise || commande.nomContact}</dd>
              </div>
              {commande.entreprise && (
                <div>
                  <dt className="text-xs text-marine-400">Contact</dt>
                  <dd className="font-medium text-marine-500">{commande.nomContact}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-marine-400">E-mail</dt>
                <dd className="font-medium text-marine-500">{commande.emailContact}</dd>
              </div>
              <div>
                <dt className="text-xs text-marine-400">Téléphone</dt>
                <dd className="font-medium text-marine-500">{commande.telContact}</dd>
              </div>
              {commande.adresseLivraison && (
                <div>
                  <dt className="text-xs text-marine-400">Livraison</dt>
                  <dd className="font-medium text-marine-500">{commande.adresseLivraison}</dd>
                </div>
              )}
            </dl>
            <Link
              href={`/admin/clients/${encodeURIComponent(commande.emailContact)}`}
              className="mt-4 inline-block text-xs font-bold text-magenta-500 hover:underline"
            >
              Voir la fiche client →
            </Link>
          </div>

          <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-marine-500">Historique</h2>
            <ul className="mt-3 space-y-3">
              {[...commande.evenements].reverse().map((e) => (
                <li key={e.id} className="border-l-2 border-marine-100 pl-3">
                  <p className="text-sm text-marine-500">{e.message}</p>
                  <p className="text-xs text-marine-300">
                    {new Date(e.creeLe).toLocaleString("fr-HT", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "America/Port-au-Prince",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
