import Image from "next/image";
import Link from "next/link";
import { Bouton } from "@/components/Bouton";

const CATEGORIES_PHARES = [
  {
    slug: "impression-grand-format",
    nom: "Impression Grand Format",
    description: "Banners, vinyl adhésif, billboard, affiches",
    couleur: "bg-magenta-50 text-magenta-600",
  },
  {
    slug: "impression-textile",
    nom: "Impression Textile",
    description: "T-shirts personnalisés et autres supports",
    couleur: "bg-cyan-50 text-cyan-600",
  },
  {
    slug: "conception-graphique",
    nom: "Conception Graphique",
    description: "Identité visuelle et créations sur mesure",
    couleur: "bg-foret-50 text-foret-600",
  },
];

export default function PageAccueil() {
  return (
    <>
      <section className="relative overflow-hidden bg-creme-100">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-magenta-500">
              Print your natural like a reality
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-marine-500 sm:text-5xl">
              L'impression et le graphisme, à la hauteur de vos idées.
            </h1>
            <p className="mt-4 max-w-lg text-marine-400">
              Grand format, textile et conception graphique. Devis instantané, commande en
              ligne, paiement sécurisé — tout depuis votre navigateur.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Bouton href="/devis" taille="normal">Demander un devis</Bouton>
              <Bouton href="/services" variante="secondaire" taille="normal">Voir les services</Bouton>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="degrade-globe absolute inset-6 rounded-full opacity-20 blur-2xl" aria-hidden />
            <Image
              src="/logo-kingos.png"
              alt="Kingo's — print your natural like a reality"
              fill
              className="relative object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-marine-500">Nos services</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {CATEGORIES_PHARES.map((categorie) => (
            <Link
              key={categorie.slug}
              href={`/services/${categorie.slug}`}
              className="group rounded-marque border border-marine-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`inline-flex rounded-marque px-3 py-1 text-xs font-semibold ${categorie.couleur}`}>
                Service
              </div>
              <h3 className="mt-4 text-lg font-semibold text-marine-500 group-hover:text-magenta-500">
                {categorie.nom}
              </h3>
              <p className="mt-2 text-sm text-marine-400">{categorie.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-marine-500 py-16 text-creme-100">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold">Un espace communautaire de ressources graphiques</h2>
          <p className="mx-auto mt-3 max-w-xl text-marine-100">
            Logos vectorisés, fichiers PSD, templates — téléchargeables gratuitement par
            toute la communauté graphique haïtienne.
          </p>
          <div className="mt-6">
            <Bouton href="/ressources" variante="primaire">Explorer les ressources</Bouton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-marque border border-marine-100 bg-creme-200 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-marine-500">Prêt à lancer votre projet ?</h2>
          <p className="mx-auto mt-2 max-w-md text-marine-400">
            Configurez votre commande en ligne et obtenez un prix instantané.
          </p>
          <div className="mt-6">
            <Bouton href="/devis">Commencer</Bouton>
          </div>
        </div>
      </section>
    </>
  );
}
