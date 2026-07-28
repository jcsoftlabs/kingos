import Image from "next/image";
import Link from "next/link";
import { apiBackend } from "@/lib/api-backend";
import { PageProvisoire } from "@/components/PageProvisoire";
import { BoutonTelecharger } from "@/components/ressources/BoutonTelecharger";

export const metadata = { title: "Ressources graphiques" };

interface Ressource {
  id: string;
  slug: string;
  titre: string;
  description: string | null;
  formats: { format: string }[];
  apercuPublicId: string;
  nbTelechargements: number;
  noteMoyenne: string;
  categorie: { nom: string; slug: string };
}

async function chargerRessources(q?: string): Promise<Ressource[]> {
  try {
    const requete = new URLSearchParams();
    if (q) requete.set("q", q);
    const { corps } = await apiBackend<Ressource[]>(`/api/ressources?${requete.toString()}`, { revalidate: 120 });
    return corps.succes && corps.donnees ? corps.donnees : [];
  } catch {
    return [];
  }
}

export default async function PageRessources({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const ressources = await chargerRessources(q);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Gratuit &amp; ouvert à tous</p>
      <h1 className="mt-2 text-3xl font-extrabold text-marine-500 sm:text-4xl">Ressources graphiques</h1>
      <p className="mt-3 max-w-2xl text-marine-400">
        Logos vectorisés, fichiers PSD, templates — un espace ouvert à toute la communauté graphique haïtienne.
      </p>

      <form className="mt-8 flex max-w-md gap-2" action="/ressources">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher une ressource…"
          className="w-full rounded-marque border border-marine-100 px-4 py-2.5 text-sm"
        />
        <button type="submit" className="rounded-marque bg-marine-500 px-5 py-2.5 text-sm font-bold text-white">
          Chercher
        </button>
      </form>

      {ressources.length === 0 ? (
        <div className="mt-10">
          <PageProvisoire
            titre="Aucune ressource pour l'instant"
            description={q ? `Aucun résultat pour « ${q} ».` : "La bibliothèque est en cours de constitution."}
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ressources.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-marque border border-marine-100 bg-white">
              <Link href={`/ressources/${r.slug}`} className="relative block aspect-[4/3] bg-creme-200">
                <Image
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_500/${r.apercuPublicId}`}
                  alt={r.titre}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-marine-300">{r.categorie.nom}</p>
                <h2 className="mt-1 font-bold text-marine-500">{r.titre}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.formats.map((f) => (
                    <BoutonTelecharger key={f.format} ressourceId={r.id} format={f.format} />
                  ))}
                </div>
                <p className="mt-3 text-xs text-marine-400">{r.nbTelechargements} téléchargement(s)</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
