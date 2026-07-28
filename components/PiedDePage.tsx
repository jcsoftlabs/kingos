import Image from "next/image";
import Link from "next/link";

export function PiedDePage() {
  return (
    <footer className="border-t border-marine-100 bg-marine-500 text-creme-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Image
            src="/logo-kingos.png"
            alt="Kingo's"
            width={140}
            height={140}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="mt-3 text-sm text-marine-100">Design &amp; Impression Professionnelle</p>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-lime">Services</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-magenta-300">Impression grand format</Link></li>
            <li><Link href="/services" className="hover:text-magenta-300">Impression textile</Link></li>
            <li><Link href="/services" className="hover:text-magenta-300">Conception graphique</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-lime">Kingo's</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/realisations" className="hover:text-magenta-300">Réalisations</Link></li>
            <li><Link href="/ressources" className="hover:text-magenta-300">Ressources graphiques</Link></li>
            <li><Link href="/a-propos" className="hover:text-magenta-300">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-magenta-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-lime">Légal</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/mentions-legales" className="hover:text-magenta-300">Mentions légales</Link></li>
            <li><Link href="/conditions-generales" className="hover:text-magenta-300">Conditions générales</Link></li>
            <li><Link href="/confidentialite" className="hover:text-magenta-300">Confidentialité</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-marine-400/40 py-4 text-center text-xs text-marine-200">
        © {new Date().getFullYear()} Kingo's — Tous droits réservés.
      </div>
    </footer>
  );
}
