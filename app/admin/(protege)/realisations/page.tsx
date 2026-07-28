import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { EntetePage } from "@/components/admin/EntetePage";
import { FormulaireNouvelleRealisation } from "@/components/admin/contenu/FormulaireNouvelleRealisation";
import { BoutonVisibiliteContenu } from "@/components/admin/contenu/BoutonVisibiliteContenu";

export const metadata = { title: "Réalisations — Admin" };

interface Realisation {
  id: string;
  titre: string;
  slug: string;
  client: string | null;
  visible: boolean;
  miseEnAvant: boolean;
  creeLe: string;
}

export default async function PageRealisationsAdmin() {
  const { corps } = await apiBackendAuthentifie<Realisation[]>("/api/admin/realisations");
  const realisations = corps.succes && corps.donnees ? corps.donnees : [];

  return (
    <>
      <EntetePage titre="Réalisations" description="Le portfolio public — chaque entrée apparaît immédiatement sur /realisations.">
        <FormulaireNouvelleRealisation />
      </EntetePage>

      <div className="overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
              <tr>
                <th className="px-5 py-3">Titre</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Créée le</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marine-100">
              {realisations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-marine-400">
                    Aucune réalisation pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                realisations.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-creme-100">
                    <td className="px-5 py-3 font-bold text-marine-500">
                      {r.titre}
                      <div className="text-xs font-normal text-marine-400">{r.slug}</div>
                    </td>
                    <td className="px-5 py-3 text-marine-400">{r.client || "—"}</td>
                    <td className="px-5 py-3 text-marine-400">{new Date(r.creeLe).toLocaleDateString("fr-HT")}</td>
                    <td className="px-5 py-3 text-right">
                      <BoutonVisibiliteContenu id={r.id} visible={r.visible} champVisibilite="visible" base="realisations" />
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
