import Image from "next/image";
import { apiBackend } from "@/lib/api-backend";
import { PageProvisoire } from "@/components/PageProvisoire";

export const metadata = { title: "Réalisations" };

interface Realisation {
  id: string;
  slug: string;
  titre: string;
  client: string | null;
  description: string | null;
  publicIdPrincipal: string;
}

async function chargerRealisations(): Promise<Realisation[]> {
  try {
    const { corps } = await apiBackend<Realisation[]>("/api/realisations", { revalidate: 300 });
    return corps.succes && corps.donnees ? corps.donnees : [];
  } catch {
    return [];
  }
}

export default async function PageRealisations() {
  const realisations = await chargerRealisations();

  if (realisations.length === 0) {
    return (
      <PageProvisoire
        titre="Nos réalisations"
        description="Le portfolio est en cours de constitution — revenez bientôt pour découvrir nos projets."
      />
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Portfolio</p>
      <h1 className="mt-2 text-3xl font-extrabold text-marine-500 sm:text-4xl">Nos réalisations</h1>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {realisations.map((r) => (
          <div key={r.id} className="overflow-hidden rounded-marque border border-marine-100 bg-white">
            <div className="relative aspect-[4/3] bg-creme-200">
              <Image
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_600/${r.publicIdPrincipal}`}
                alt={r.titre}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="font-bold text-marine-500">{r.titre}</h2>
              {r.client && <p className="text-xs text-marine-400">{r.client}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
