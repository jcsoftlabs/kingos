import Link from "next/link";
import { notFound } from "next/navigation";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { EntetePage } from "@/components/admin/EntetePage";
import { FormulaireMouvement } from "@/components/admin/inventaire/FormulaireMouvement";

const LIBELLES_TYPE: Record<string, string> = { ENTREE: "Entrée", SORTIE: "Sortie", AJUSTEMENT: "Ajustement" };

interface Mouvement {
  id: string;
  type: string;
  quantite: string;
  motif: string | null;
  commandeId: string | null;
  creeLe: string;
}

interface Article {
  id: string;
  nom: string;
  categorie: string | null;
  unite: string;
  quantiteActuelle: string;
  seuilAlerte: string;
  notes: string | null;
  enAlerte: boolean;
  mouvements: Mouvement[];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { corps } = await apiBackendAuthentifie<Article>(`/api/admin/inventaire/articles/${id}`);
  return { title: `${corps.donnees?.nom ?? "Article"} — Inventaire` };
}

export default async function PageArticleInventaire({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { corps } = await apiBackendAuthentifie<Article>(`/api/admin/inventaire/articles/${id}`);
  if (!corps.succes || !corps.donnees) notFound();
  const article = corps.donnees;

  return (
    <>
      <Link href="/admin/inventaire" className="text-xs font-bold text-marine-400 hover:text-magenta-500">
        ← Tous les articles
      </Link>

      <EntetePage titre={article.nom} description={article.categorie ?? undefined}>
        {article.enAlerte && (
          <span className="inline-flex rounded-full bg-magenta-50 px-3 py-1 text-xs font-bold text-magenta-600">
            Stock sous le seuil d&apos;alerte
          </span>
        )}
      </EntetePage>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-marine-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">Quantité actuelle</p>
          <p className="mt-1.5 text-lg font-extrabold text-marine-500">
            {article.quantiteActuelle} {article.unite}
          </p>
        </div>
        <div className="rounded-xl border border-marine-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">Seuil d&apos;alerte</p>
          <p className="mt-1.5 text-lg font-extrabold text-marine-500">
            {article.seuilAlerte} {article.unite}
          </p>
        </div>
        <div className="rounded-xl border border-marine-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-marine-400">Notes</p>
          <p className="mt-1.5 text-sm text-marine-500">{article.notes || "—"}</p>
        </div>
      </div>

      <div className="mt-5">
        <FormulaireMouvement articleId={article.id} unite={article.unite} />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="border-b border-marine-100 px-5 py-4">
          <h2 className="text-sm font-bold text-marine-500">Historique des mouvements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">Quantité</th>
                <th className="px-5 py-3">Motif</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {article.mouvements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-marine-400">
                    Aucun mouvement pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                article.mouvements.map((m) => (
                  <tr key={m.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          m.type === "ENTREE"
                            ? "bg-foret-50 text-foret-700"
                            : m.type === "SORTIE"
                              ? "bg-magenta-50 text-magenta-600"
                              : "bg-marine-50 text-marine-400"
                        }`}
                      >
                        {LIBELLES_TYPE[m.type] ?? m.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
                      {m.quantite} {article.unite}
                    </td>
                    <td className="px-5 py-3 text-marine-400">
                      {m.motif ?? "—"}
                      {m.commandeId && <span className="ml-1 text-[11px] text-marine-300">(auto — production)</span>}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-marine-400">
                      {new Date(m.creeLe).toLocaleString("fr-HT", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
