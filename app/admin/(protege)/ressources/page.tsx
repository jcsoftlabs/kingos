import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { EntetePage } from "@/components/admin/EntetePage";
import { FormulaireNouvelleRessource } from "@/components/admin/contenu/FormulaireNouvelleRessource";
import { BoutonVisibiliteContenu } from "@/components/admin/contenu/BoutonVisibiliteContenu";

export const metadata = { title: "Ressources — Admin" };

interface Categorie {
  id: string;
  nom: string;
}
interface Ressource {
  id: string;
  titre: string;
  slug: string;
  auteur: string | null;
  publiee: boolean;
  nbTelechargements: number;
  creeLe: string;
  categorie: { nom: string };
}

export default async function PageRessourcesAdmin() {
  const [{ corps: corpsRessources }, { corps: corpsCategories }] = await Promise.all([
    apiBackendAuthentifie<Ressource[]>("/api/admin/ressources"),
    apiBackendAuthentifie<Categorie[]>("/api/admin/ressources/categories"),
  ]);
  const ressources = corpsRessources.succes && corpsRessources.donnees ? corpsRessources.donnees : [];
  const categories = corpsCategories.succes && corpsCategories.donnees ? corpsCategories.donnees : [];

  return (
    <>
      <EntetePage titre="Ressources" description="La bibliothèque de fichiers téléchargeables publique (/ressources).">
        <FormulaireNouvelleRessource categories={categories} />
      </EntetePage>

      {categories.length === 0 && (
        <p className="mb-4 rounded-marque bg-creme-200 px-4 py-3 text-sm text-marine-400">
          Aucune catégorie de ressources n&apos;existe encore — elle se crée directement en base pour l&apos;instant
          (hors du périmètre de cet écran).
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Titre</th>
                <th className="px-5 py-3">Catégorie</th>
                <th className="px-5 py-3 text-right">Téléchargements</th>
                <th className="px-5 py-3">Créée le</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {ressources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-marine-400">
                    Aucune ressource pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                ressources.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3 font-bold text-marine-500">
                      {r.titre}
                      <div className="text-xs font-normal text-marine-400">{r.slug}</div>
                    </td>
                    <td className="px-5 py-3 text-marine-400">{r.categorie.nom}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-marine-500">{r.nbTelechargements}</td>
                    <td className="px-5 py-3 text-marine-400">
                      {new Date(r.creeLe).toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <BoutonVisibiliteContenu id={r.id} visible={r.publiee} champVisibilite="publiee" base="ressources" />
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
