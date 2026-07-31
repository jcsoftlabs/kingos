import Link from "next/link";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { EntetePage } from "@/components/admin/EntetePage";
import { FormulaireNouvelArticle } from "@/components/admin/inventaire/FormulaireNouvelArticle";

export const metadata = { title: "Inventaires — Admin" };

interface Article {
  id: string;
  nom: string;
  categorie: string | null;
  unite: string;
  quantiteActuelle: string;
  seuilAlerte: string;
  enAlerte: boolean;
}

export default async function PageInventaireAdmin() {
  const { corps } = await apiBackendAuthentifie<Article[]>("/api/admin/inventaire/articles");
  const articles = corps.succes && corps.donnees ? corps.donnees : [];
  const nbEnAlerte = articles.filter((a) => a.enAlerte).length;

  return (
    <>
      <EntetePage
        titre="Inventaires"
        description="Stock de matières et consommables. Un service du catalogue lié à un article décrémente automatiquement le stock quand une commande passe en production."
      >
        <FormulaireNouvelArticle />
      </EntetePage>

      {nbEnAlerte > 0 && (
        <p className="mb-4 rounded-marque bg-magenta-50 px-4 py-3 text-sm font-bold text-magenta-600">
          {nbEnAlerte} article(s) sous le seuil d&apos;alerte — pensez à réapprovisionner.
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Article</th>
                <th className="px-5 py-3">Catégorie</th>
                <th className="px-5 py-3 text-right">Quantité</th>
                <th className="px-5 py-3 text-right">Seuil d&apos;alerte</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-marine-400">
                    Aucun article pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                articles.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3">
                      <Link href={`/admin/inventaire/${a.id}`} className="font-bold text-marine-500 hover:text-magenta-500 hover:underline">
                        {a.nom}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-marine-400">{a.categorie ?? "—"}</td>
                    <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
                      {a.quantiteActuelle} {a.unite}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-marine-400">
                      {a.seuilAlerte} {a.unite}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {a.enAlerte && (
                        <span className="inline-flex rounded-full bg-magenta-50 px-2 py-0.5 text-[10px] font-bold text-magenta-600">
                          Stock bas
                        </span>
                      )}
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
