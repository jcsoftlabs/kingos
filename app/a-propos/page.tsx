import { Bouton } from "@/components/Bouton";

export const metadata = { title: "À propos" };

export default function PageAPropos() {
  return (
    <>
      <section className="bg-marine-500 py-16 text-creme-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-wide text-lime">À propos</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            L&apos;impression et le graphisme, pensés pour Haïti.
          </h1>
          <p className="mt-4 max-w-2xl text-marine-100">
            Kingo&apos;s s&apos;est imposé comme un acteur incontournable du graphisme et de l&apos;impression en
            Haïti — grand format, textile, conception graphique. Notre plateforme en ligne permet de
            découvrir, configurer et commander en quelques minutes, avec un prix calculé en direct.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="mb-3 h-1.5 w-10 rounded-full bg-magenta-500" />
            <h2 className="text-lg font-extrabold text-marine-500">Expertise locale</h2>
            <p className="mt-2 text-sm text-marine-400">
              Une connaissance fine du marché haïtien — matériaux, délais, moyens de paiement.
            </p>
          </div>
          <div>
            <div className="mb-3 h-1.5 w-10 rounded-full bg-cyan-500" />
            <h2 className="text-lg font-extrabold text-marine-500">Service en ligne</h2>
            <p className="mt-2 text-sm text-marine-400">
              Devis instantané, suivi de commande, paiement flexible — sans avoir à se déplacer.
            </p>
          </div>
          <div>
            <div className="mb-3 h-1.5 w-10 rounded-full bg-foret-500" />
            <h2 className="text-lg font-extrabold text-marine-500">Communauté graphique</h2>
            <p className="mt-2 text-sm text-marine-400">
              Un espace de ressources gratuites ouvert à tous les créateurs haïtiens.
            </p>
          </div>
        </div>

        <div className="mt-14 rounded-marque border border-marine-100 bg-creme-200 p-8 text-center">
          <h2 className="text-2xl font-extrabold text-marine-500">Une question, un projet ?</h2>
          <p className="mt-2 text-marine-400">Notre équipe vous répond rapidement.</p>
          <div className="mt-6">
            <Bouton href="/contact">Nous contacter</Bouton>
          </div>
        </div>
      </section>
    </>
  );
}
