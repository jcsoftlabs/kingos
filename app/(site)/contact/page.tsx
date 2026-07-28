import { FormulaireContact } from "@/components/contact/FormulaireContact";

export const metadata = { title: "Contact" };

export default function PageContact() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Contact</p>
      <h1 className="mt-2 text-3xl font-extrabold text-marine-500 sm:text-4xl">Contactez Kingo&apos;s</h1>
      <p className="mt-3 text-marine-400">
        Une question sur un service, un projet sur mesure ? Écrivez-nous, nous vous répondons rapidement.
      </p>

      <div className="mt-10">
        <FormulaireContact />
      </div>
    </section>
  );
}
