import Link from "next/link";
import { apiBackend } from "@/lib/api-backend";
import { PageProvisoire } from "@/components/PageProvisoire";
import type { CategorieResume } from "@/lib/types-catalogue";

export const metadata = { title: "Services" };

async function chargerCategories(): Promise<CategorieResume[]> {
  try {
    const { corps } = await apiBackend<CategorieResume[]>("/api/catalogue/categories", { revalidate: 300 });
    return corps.succes && corps.donnees ? corps.donnees.filter((c) => c.services.length > 0) : [];
  } catch {
    return [];
  }
}

export default async function PageServices() {
  const categories = await chargerCategories();

  if (categories.length === 0) {
    return (
      <PageProvisoire
        titre="Nos services"
        description="Le catalogue n'est pas encore configuré côté back-office — revenez bientôt."
      />
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Nos services</p>
      <h1 className="mt-2 text-3xl font-extrabold text-marine-500 sm:text-4xl">Impression &amp; conception graphique</h1>
      <p className="mt-3 max-w-2xl text-marine-400">
        Grand format, textile, identité visuelle — chaque service a son propre configurateur de devis instantané.
      </p>

      <div className="mt-12 space-y-14">
        {categories.map((categorie) => (
          <div key={categorie.slug}>
            <h2 className="text-xl font-extrabold text-marine-500">{categorie.nom}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categorie.services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${categorie.slug}/${service.slug}`}
                  className="group rounded-marque border border-marine-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-extrabold text-marine-500 group-hover:text-magenta-500">{service.nom}</h3>
                  <p className="mt-2 text-sm text-marine-400">{service.resume}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-marine-300">
                    Délai {service.delaiJours} jour{service.delaiJours > 1 ? "s" : ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
