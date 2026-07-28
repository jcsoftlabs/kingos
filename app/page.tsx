import Image from "next/image";
import Link from "next/link";
import { Bouton } from "@/components/Bouton";
import { IllustrationBanniere } from "@/components/illustrations/IllustrationBanniere";
import { IllustrationTshirt } from "@/components/illustrations/IllustrationTshirt";
import { IllustrationCrayon } from "@/components/illustrations/IllustrationCrayon";
import { IllustrationDossier } from "@/components/illustrations/IllustrationDossier";
import { IllustrationOrbite } from "@/components/illustrations/IllustrationOrbite";
import { MotifPoints } from "@/components/illustrations/MotifPoints";
import {
  IconeEclair,
  IconeCurseur,
  IconeTelephone,
  IconeDocument,
  IconeTelechargement,
  IconeRadar,
} from "@/components/icones";

// Nuances choisies pour que le texte blanc tienne 4.5:1 sur chaque tuile (la
// version bg-cyan-500/bg-magenta-500 initiale tombait à 2.9:1 et 4.4:1 —
// voir l'audit de contraste). Les quatre tuiles visent maintenant un contraste
// comparable (6,4 à 13:1) pour que le bloc se lise comme un ensemble, pas
// quatre couleurs qui se disputent l'attention.
const TUILES_SERVICES = [
  {
    slug: "impression-grand-format",
    nom: "Impression Grand Format",
    tag: "BANNERS · VINYL · BILLBOARD",
    classe: "bg-magenta-600 text-white",
    Illustration: IllustrationBanniere,
  },
  {
    slug: "impression-textile",
    nom: "Impression Textile",
    tag: "T-SHIRTS · SUPPORTS PERSONNALISÉS",
    classe: "bg-cyan-700 text-white",
    Illustration: IllustrationTshirt,
  },
  {
    slug: "conception-graphique",
    nom: "Conception Graphique",
    tag: "IDENTITÉ VISUELLE · LOGO",
    classe: "bg-foret-500 text-white",
    Illustration: IllustrationCrayon,
  },
  {
    slug: "ressources",
    nom: "Ressources Graphiques",
    tag: "GRATUIT · TÉLÉCHARGEABLE",
    classe: "bg-lime text-marine-500",
    Illustration: IllustrationDossier,
  },
];

const CE_QUON_FAIT = [
  {
    titre: "Devis instantané",
    texte:
      "Configurez dimensions, matériaux et quantités : le prix s'affiche en direct, sans attendre un aller-retour par e-mail.",
    Icone: IconeEclair,
  },
  {
    titre: "Commande en ligne",
    texte:
      "Téléversez vos fichiers, suivez la production en temps réel, recevez vos confirmations automatiquement.",
    Icone: IconeCurseur,
  },
  {
    titre: "Paiement local",
    texte:
      "MonCash, carte, virement, chèque ou espèces à l'atelier — vous payez comme ça vous arrange.",
    Icone: IconeTelephone,
  },
  {
    titre: "Facturation automatique",
    texte:
      "Devis converti en facture officielle en un clic, avec vos coordonnées bancaires et votre adresse.",
    Icone: IconeDocument,
  },
  {
    titre: "Ressources gratuites",
    texte:
      "Logos vectorisés, fichiers PSD, templates — un espace ouvert à toute la communauté graphique haïtienne.",
    Icone: IconeTelechargement,
  },
  {
    titre: "Suivi en temps réel",
    texte:
      "De la commande à la livraison, vous savez toujours où en est votre projet, sans avoir à demander.",
    Icone: IconeRadar,
  },
];

export default function PageAccueil() {
  return (
    <>
      {/* HERO — plein écran sombre, typographie surdimensionnée */}
      <section className="relative overflow-hidden bg-marine-500 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <MotifPoints className="text-white/[0.06]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-lime">
            Print your natural like a reality
          </p>
          <h1 className="text-5xl font-extrabold text-white sm:text-7xl">
            Salut, on est <span className="text-magenta-400">Kingo&apos;s</span> — l&apos;atelier qui imprime
            vos idées en grand.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-marine-100">
            Grand format, textile et conception graphique en Haïti. Devis instantané, commande
            en ligne, paiement sécurisé — tout depuis votre navigateur.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Bouton href="/devis" taille="grand">Démarrer un projet</Bouton>
            <Bouton href="/realisations" variante="contourClair" taille="grand">
              Voir nos réalisations →
            </Bouton>
          </div>
        </div>
      </section>

      {/* GRILLE DE SERVICES — tuiles plein bord, colorées, avec mockup illustré */}
      <section className="grid sm:grid-cols-2">
        {TUILES_SERVICES.map((tuile) => (
          <Link
            key={tuile.slug}
            href={`/services/${tuile.slug}`}
            className={`tuile-service group relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-8 transition-transform sm:p-12 ${tuile.classe}`}
          >
            <tuile.Illustration />
            <span className="relative text-xs font-bold tracking-[0.15em]">{tuile.tag}</span>
            <span className="relative mt-2 flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
              {tuile.nom}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </section>

      {/* BANDE CTA SOMBRE */}
      <section className="relative overflow-hidden bg-marine-500 py-16 text-center">
        <MotifPoints className="text-white/[0.06]" />
        <div className="relative">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Envie de voir ce qu&apos;on a déjà réalisé ?
          </h2>
          <div className="mt-6">
            <Bouton href="/realisations" variante="contourClair" taille="grand">
              Voir le portfolio
            </Bouton>
          </div>
        </div>
      </section>

      {/* GROS VISUEL DE MARQUE — anneaux du globe en grand format, plus vivant qu'un simple cadre */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="relative mx-auto flex aspect-[16/10] max-w-3xl items-center justify-center overflow-hidden rounded-[3rem] bg-marine-500 shadow-2xl">
          <IllustrationOrbite />
          <Image
            src="/logo-kingos.png"
            alt="Kingo's"
            width={520}
            height={520}
            className="relative w-2/3 max-w-sm brightness-0 invert"
          />
        </div>

        <p className="mx-auto mt-14 max-w-2xl text-center text-2xl font-medium leading-snug text-marine-500 sm:text-3xl">
          On aide les entreprises et institutions en Haïti à sortir du lot avec des impressions
          qui se remarquent, et un service en ligne qui ne fait pas perdre de temps.
        </p>
      </section>

      {/* CE QU'ON FAIT — grille 3 colonnes, icônes plutôt que simples barres */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-extrabold text-marine-500 sm:text-4xl">Ce qu&apos;on fait</h2>
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
          {CE_QUON_FAIT.map((item) => (
            <div key={item.titre}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-marque bg-magenta-50 text-magenta-500">
                <item.Icone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-marine-500">{item.titre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-marine-400">{item.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BANDE SOMBRE — déclaration + argumentaire */}
      <section className="relative overflow-hidden bg-marine-500 py-20 text-creme-100">
        <MotifPoints className="text-white/[0.06]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Construisez votre image, développez votre activité.
          </h2>
          <div className="space-y-4 text-marine-100">
            <p>
              Une impression réussie, c&apos;est la première impression que votre client retient.
              Banner, t-shirt d&apos;équipe ou identité de marque : chaque support est une occasion
              de marquer les esprits.
            </p>
            <p>
              De la PME qui lance sa première commande à l&apos;institution qui gère des dizaines
              d&apos;interventions par mois, Kingo&apos;s s&apos;adapte à votre rythme — et à votre budget.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold text-marine-500 sm:text-4xl">
          Prêt à lancer votre projet ?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-marine-400">
          Configurez votre commande en ligne et obtenez un prix instantané, sans engagement.
        </p>
        <div className="mt-8">
          <Bouton href="/devis" taille="grand">Commencer maintenant</Bouton>
        </div>
      </section>
    </>
  );
}
