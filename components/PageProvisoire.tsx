import { Bouton } from "./Bouton";

/**
 * Gabarit pour les pages dont le contenu métier (module 5, 6, 7, 9...) n'est
 * pas encore implémenté. Garde la navigation cohérente et le thème appliqué
 * pendant que le développement des modules avance phase par phase (plan §18).
 */
export function PageProvisoire({ titre, description }: { titre: string; description: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-magenta-500">Kingo's</p>
      <h1 className="mt-2 text-3xl font-bold text-marine-500">{titre}</h1>
      <p className="mt-4 text-marine-400">{description}</p>
      <div className="mt-8">
        <Bouton href="/">Retour à l'accueil</Bouton>
      </div>
    </section>
  );
}
