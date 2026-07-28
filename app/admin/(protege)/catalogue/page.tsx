import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { FormulaireNouvelleCategorie } from "@/components/admin/catalogue/FormulaireNouvelleCategorie";
import { FormulaireNouveauService } from "@/components/admin/catalogue/FormulaireNouveauService";
import { BoutonVisibilite } from "@/components/admin/catalogue/BoutonVisibilite";
import { EntetePage } from "@/components/admin/EntetePage";

export const metadata = { title: "Catalogue — Admin" };

interface Service {
  id: string;
  slug: string;
  nom: string;
  mode: string;
  prixBaseCents: string;
  unite: string | null;
  visible: boolean;
  attributs: { id: string }[];
}

interface Categorie {
  id: string;
  nom: string;
  slug: string;
  services: Service[];
}

export default async function PageCatalogueAdmin() {
  const { corps } = await apiBackendAuthentifie<Categorie[]>("/api/admin/catalogue");
  const categories = corps.succes && corps.donnees ? corps.donnees : [];

  return (
    <>
      <EntetePage
        titre="Catalogue"
        description="Un service créé ici apparaît immédiatement sur la vitrine et le configurateur de devis — aucun redéploiement nécessaire."
      >
        <FormulaireNouvelleCategorie />
      </EntetePage>

      <div>
        <FormulaireNouveauService categories={categories.map((c) => ({ id: c.id, nom: c.nom }))} />
      </div>

      <div className="mt-8 space-y-8">
        {categories.length === 0 ? (
          <p className="text-marine-400">Aucune catégorie pour l&apos;instant.</p>
        ) : (
          categories.map((categorie) => (
            <div key={categorie.id}>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-marine-400">{categorie.nom}</h2>
              <div className="mt-2 overflow-hidden rounded-xl border border-marine-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-marine-100 bg-creme-100 text-left text-[11px] font-bold uppercase tracking-wide text-marine-400">
                      <tr>
                        <th className="px-5 py-3">Service</th>
                        <th className="px-5 py-3">Mode</th>
                        <th className="px-5 py-3">Options</th>
                        <th className="px-5 py-3 text-right">Prix de base</th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-marine-100">
                      {categorie.services.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center text-marine-400">
                            Aucun service dans cette catégorie.
                          </td>
                        </tr>
                      ) : (
                        categorie.services.map((service) => (
                          <tr key={service.id} className="transition-colors hover:bg-creme-100">
                            <td className="px-5 py-3 font-bold text-marine-500">
                              {service.nom}
                              <div className="text-xs font-normal text-marine-400">{service.slug}</div>
                            </td>
                            <td className="px-5 py-3 text-marine-400">{service.mode}</td>
                            <td className="px-5 py-3 text-marine-400">{service.attributs.length}</td>
                            <td className="px-5 py-3 text-right font-bold tabular-nums text-marine-500">
                              {formaterHTG(service.prixBaseCents)}
                              {service.unite && <span className="font-normal text-marine-400"> / {service.unite}</span>}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <BoutonVisibilite serviceId={service.id} visible={service.visible} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
