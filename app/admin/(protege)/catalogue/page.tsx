import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { FormulaireNouvelleCategorie } from "@/components/admin/catalogue/FormulaireNouvelleCategorie";
import { FormulaireNouveauService } from "@/components/admin/catalogue/FormulaireNouveauService";
import { GestionCategorie } from "@/components/admin/catalogue/GestionCategorie";
import { LigneService } from "@/components/admin/catalogue/LigneService";
import { ImportCsv } from "@/components/admin/catalogue/ImportCsv";
import { EntetePage } from "@/components/admin/EntetePage";

export const metadata = { title: "Catalogue — Admin" };

interface Option {
  id: string;
  valeur: string;
  libelle: string;
  coefficient: string | null;
  supplementCents: string | null;
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
  resume: string;
  description: string;
  mode: string;
  prixBaseCents: string;
  unite: string | null;
  delaiJours: number;
  visible: boolean;
  attributs: Attribut[];
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

      <div className="mt-4">
        <ImportCsv />
      </div>

      <div className="mt-8 space-y-8">
        {categories.length === 0 ? (
          <p className="text-marine-400">Aucune catégorie pour l&apos;instant.</p>
        ) : (
          categories.map((categorie) => (
            <div key={categorie.id}>
              <GestionCategorie categorieId={categorie.id} nom={categorie.nom} nbServices={categorie.services.length} />
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
                        categorie.services.map((service) => <LigneService key={service.id} service={service} />)
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
