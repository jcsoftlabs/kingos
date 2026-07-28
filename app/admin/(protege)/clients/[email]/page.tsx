import Link from "next/link";
import { notFound } from "next/navigation";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { EntetePage } from "@/components/admin/EntetePage";
import { BadgeStatut } from "@/components/admin/BadgeStatut";
import { FormulaireCoordonneesClient } from "@/components/admin/clients/FormulaireCoordonneesClient";

const LIBELLES_TYPE_CLIENT: Record<string, string> = {
  PARTICULIER: "Particulier",
  ENTREPRISE: "Entreprise",
  ONG: "ONG",
  INSTITUTION_ETATIQUE: "Institution étatique",
};

interface FicheClient {
  email: string;
  nom: string;
  entreprise: string | null;
  typeClient: string;
  telephone: string;
  adresseLivraison: string | null;
  compte: { id: string; email: string; creeLe: string; derniereConnexion: string | null } | null;
  stats: {
    nbCommandes: number;
    caRegleCents: string | null;
    impayeCents: string | null;
    panierMoyenCents: string | null;
    premiereCommandeLe: string | null;
    derniereCommandeLe: string | null;
  };
  commandes: { id: string; numero: string; statut: string; totalCents?: string; creeLe: string; lignes: { serviceNom: string; quantite: number }[] }[];
  factures: { id: string; numero: string; statut: string; totalCents?: string; payeCents?: string; creeLe: string }[];
  devis: { id: string; numero: string; statut: string; totalCents?: string; creeLe: string; expireLe: string }[];
}

export async function generateMetadata({ params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  return { title: `${decodeURIComponent(email)} — Clients` };
}

function Stat({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="rounded-xl border border-marine-100 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">{libelle}</p>
      <p className="mt-1.5 text-lg font-extrabold text-marine-500">{valeur}</p>
    </div>
  );
}

export default async function PageFicheClient({ params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  const { corps } = await apiBackendAuthentifie<FicheClient>(`/api/admin/clients/${email}`);
  if (!corps.succes || !corps.donnees) notFound();
  const client = corps.donnees;
  const { stats } = client;

  return (
    <>
      <Link href="/admin/clients" className="text-xs font-bold text-marine-400 hover:text-magenta-500">
        ← Tous les clients
      </Link>

      <EntetePage
        titre={client.entreprise || client.nom}
        description={client.entreprise ? `Contact : ${client.nom}` : undefined}
      >
        <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
          {LIBELLES_TYPE_CLIENT[client.typeClient] ?? client.typeClient}
        </span>
      </EntetePage>

      <div className="grid gap-5 lg:grid-cols-3">
        <FormulaireCoordonneesClient
          email={client.email}
          nom={client.nom}
          entreprise={client.entreprise}
          typeClient={client.typeClient}
          telephone={client.telephone}
          adresseLivraison={client.adresseLivraison}
          compte={client.compte}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <Stat libelle="Commandes" valeur={String(stats.nbCommandes)} />
          <Stat libelle="CA réglé" valeur={stats.caRegleCents !== null ? formaterHTG(stats.caRegleCents) : "—"} />
          <Stat
            libelle="Impayé"
            valeur={stats.impayeCents !== null ? formaterHTG(stats.impayeCents) : "—"}
          />
          <Stat
            libelle="Panier moyen"
            valeur={stats.panierMoyenCents !== null ? formaterHTG(stats.panierMoyenCents) : "—"}
          />
          <div className="rounded-xl border border-marine-100 bg-white p-4 shadow-sm sm:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">Relation client</p>
            <p className="mt-1.5 text-sm text-marine-500">
              {stats.premiereCommandeLe ? (
                <>
                  Client depuis le{" "}
                  <strong>{new Date(stats.premiereCommandeLe).toLocaleDateString("fr-HT")}</strong>
                  {stats.derniereCommandeLe && (
                    <> — dernière commande le <strong>{new Date(stats.derniereCommandeLe).toLocaleDateString("fr-HT")}</strong></>
                  )}
                </>
              ) : (
                "—"
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="border-b border-marine-100 px-5 py-4">
          <h2 className="text-sm font-bold text-marine-500">Commandes ({client.commandes.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Numéro</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {client.commandes.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-creme-100">
                  <td className="px-5 py-3 font-bold text-marine-500">
                    <Link href={`/admin/commandes/${c.numero}`} className="hover:text-magenta-500 hover:underline">
                      {c.numero}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-marine-400">{c.lignes[0]?.serviceNom ?? "—"}</td>
                  <td className="px-5 py-3"><BadgeStatut statut={c.statut} /></td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
                    {c.totalCents !== undefined ? formaterHTG(c.totalCents) : "—"}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                    {new Date(c.creeLe).toLocaleDateString("fr-HT")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
          <div className="border-b border-marine-100 px-5 py-4">
            <h2 className="text-sm font-bold text-marine-500">Devis ({client.devis.length})</h2>
          </div>
          {client.devis.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-marine-400">Aucun devis.</p>
          ) : (
            <ul className="divide-y divide-marine-100">
              {client.devis.map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex-1 font-bold text-marine-500">{d.numero}</span>
                  <BadgeStatut statut={d.statut} />
                  <span className="w-28 text-right font-bold tabular-nums text-marine-500">
                    {d.totalCents !== undefined ? formaterHTG(d.totalCents) : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
          <div className="border-b border-marine-100 px-5 py-4">
            <h2 className="text-sm font-bold text-marine-500">Factures ({client.factures.length})</h2>
          </div>
          {client.factures.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-marine-400">Aucune facture.</p>
          ) : (
            <ul className="divide-y divide-marine-100">
              {client.factures.map((f) => (
                <li key={f.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex-1 font-bold text-marine-500">{f.numero}</span>
                  <BadgeStatut statut={f.statut} />
                  <span className="w-28 text-right font-bold tabular-nums text-marine-500">
                    {f.totalCents !== undefined ? formaterHTG(f.totalCents) : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
