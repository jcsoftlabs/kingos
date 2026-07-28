import { notFound } from "next/navigation";
import { apiBackend } from "@/lib/api-backend";
import { Bouton } from "@/components/Bouton";
import type { ServiceDetail } from "@/lib/types-catalogue";

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  return { title: service };
}

export default async function PageServiceDetail({ params }: { params: Promise<{ categorie: string; service: string }> }) {
  const { service: slug } = await params;

  const { corps } = await apiBackend<ServiceDetail>(`/api/catalogue/services/${slug}`, { revalidate: 300 });
  if (!corps.succes || !corps.donnees) notFound();
  const service = corps.donnees;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">{service.categorie.nom}</p>
      <h1 className="mt-2 text-3xl font-extrabold text-marine-500 sm:text-4xl">{service.nom}</h1>
      <p className="mt-4 max-w-2xl text-marine-400">{service.description}</p>

      <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide text-marine-400">
        <span className="rounded-marque bg-creme-200 px-3 py-1.5">Délai {service.delaiJours} jour(s)</span>
        {service.unite && <span className="rounded-marque bg-creme-200 px-3 py-1.5">Facturé au {service.unite}</span>}
        {service.mode === "SUR_DEVIS" && (
          <span className="rounded-marque bg-magenta-50 px-3 py-1.5 text-magenta-600">Chiffrage sur mesure</span>
        )}
      </div>

      {service.attributs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-marine-400">Options disponibles</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {service.attributs.map((attribut) => (
              <div key={attribut.id} className="rounded-marque border border-marine-100 bg-white p-4">
                <p className="text-sm font-bold text-marine-500">{attribut.libelle}</p>
                {attribut.options.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-marine-400">
                    {attribut.options.map((option) => (
                      <li key={option.id}>{option.libelle}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 rounded-marque border border-marine-100 bg-creme-200 p-8 text-center">
        <p className="text-marine-500">
          {service.mode === "SUR_DEVIS"
            ? "Ce service se chiffre sur mesure — contactez-nous pour un devis personnalisé."
            : "Configurez vos dimensions et quantités pour obtenir un prix instantané."}
        </p>
        <div className="mt-4">
          <Bouton href={service.mode === "SUR_DEVIS" ? "/contact" : "/devis"}>
            {service.mode === "SUR_DEVIS" ? "Nous contacter" : "Demander un devis"}
          </Bouton>
        </div>
      </div>
    </section>
  );
}
