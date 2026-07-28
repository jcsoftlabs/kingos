import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { EntetePage } from "@/components/admin/EntetePage";
import { ChampRecherche } from "@/components/admin/ChampRecherche";
import { Bouton } from "@/components/Bouton";

export const metadata = { title: "Clients — Admin" };

const LIBELLES_TYPE_CLIENT: Record<string, string> = {
  PARTICULIER: "Particulier",
  ENTREPRISE: "Entreprise",
  ONG: "ONG",
  INSTITUTION_ETATIQUE: "Institution étatique",
};

interface ClientResume {
  email: string;
  nom: string;
  entreprise: string | null;
  typeClient: string;
  telephone: string;
  utilisateurId: string | null;
  nbCommandes: number;
  caRegleCents?: string;
  impayeCents?: string;
  derniereCommandeLe: string;
}

interface Reponse {
  succes: boolean;
  donnees?: ClientResume[];
  meta?: { page: number; total: number; pages: number };
}

export default async function PageClientsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ recherche?: string; page?: string }>;
}) {
  const params = await searchParams;
  const requete = new URLSearchParams();
  if (params.recherche) requete.set("recherche", params.recherche);
  if (params.page) requete.set("page", params.page);

  const { corps } = await apiBackendAuthentifie<ClientResume[]>(`/api/admin/clients?${requete.toString()}`);
  const reponse = corps as Reponse;
  const clients = reponse.succes && reponse.donnees ? reponse.donnees : [];

  return (
    <>
      <EntetePage
        titre="Clients"
        description="Chaque client est identifié par son e-mail de contact — les commandes passées sans compte sont donc incluses."
      >
        <Bouton taille="petit" href="/admin/commandes/nouvelle">
          Nouvelle commande
        </Bouton>
      </EntetePage>

      <ChampRecherche placeholder="Rechercher un nom, une entreprise, un e-mail, un téléphone…" />

      <div className="mt-5 overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3 text-right">Commandes</th>
                <th className="px-5 py-3 text-right">CA réglé</th>
                <th className="px-5 py-3 text-right">Impayé</th>
                <th className="px-5 py-3">Dernière</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-marine-400">
                    {params.recherche ? "Aucun client ne correspond à cette recherche." : "Aucun client pour l'instant."}
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr key={c.email} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/clients/${encodeURIComponent(c.email)}`}
                        className="font-bold text-marine-500 hover:text-magenta-500 hover:underline"
                      >
                        {c.entreprise || c.nom}
                      </Link>
                      {c.entreprise && <div className="text-xs text-marine-400">{c.nom}</div>}
                      <div className="mt-1 flex gap-1">
                        <span className="inline-flex rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-700">
                          {LIBELLES_TYPE_CLIENT[c.typeClient] ?? c.typeClient}
                        </span>
                        {!c.utilisateurId && (
                          <span className="inline-flex rounded-full bg-marine-50 px-2 py-0.5 text-[10px] font-bold text-marine-400">
                            sans compte
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-marine-500">{c.email}</div>
                      <div className="text-xs text-marine-400">{c.telephone}</div>
                    </td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">{c.nbCommandes}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
                      {c.caRegleCents !== undefined ? formaterHTG(c.caRegleCents) : "—"}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {c.impayeCents === undefined ? (
                        "—"
                      ) : Number(c.impayeCents) > 0 ? (
                        <span className="font-bold text-magenta-600">{formaterHTG(c.impayeCents)}</span>
                      ) : (
                        <span className="text-marine-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                      {new Date(c.derniereCommandeLe).toLocaleDateString("fr-HT")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {reponse.meta && clients.length > 0 && (
          <div className="border-t border-marine-100 px-5 py-3 text-xs text-marine-400">
            Page {reponse.meta.page} / {reponse.meta.pages || 1} — {reponse.meta.total} client(s)
          </div>
        )}
      </div>
    </>
  );
}
