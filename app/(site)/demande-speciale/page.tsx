import { FormulaireDemande } from "@/components/demandes/FormulaireDemande";

export const metadata = { title: "Demande spéciale — Kingo's" };

export default function PageDemandeSpeciale() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Demande spéciale</p>
      <h1 className="mt-2 text-3xl font-extrabold text-marine-500 sm:text-4xl">Votre projet sort du catalogue ?</h1>
      <p className="mt-3 text-marine-400">
        Décrivez ce dont vous avez besoin — un service sur mesure, une réparation, un conseil — et notre équipe vous
        recontacte avec une solution adaptée.
      </p>

      <div className="mt-10">
        <FormulaireDemande />
      </div>
    </section>
  );
}
