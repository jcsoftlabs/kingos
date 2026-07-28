import Image from "next/image";
import Link from "next/link";
import { Bouton } from "./Bouton";

const LIENS = [
  { href: "/services", libelle: "Services" },
  { href: "/realisations", libelle: "Réalisations" },
  { href: "/ressources", libelle: "Ressources" },
  { href: "/a-propos", libelle: "À propos" },
  { href: "/contact", libelle: "Contact" },
];

export function Entete() {
  return (
    <header className="sticky top-0 z-40 border-b border-marine-100 bg-creme-100/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Accueil Kingo's">
          <Image src="/logo-kingos.png" alt="Kingo's" width={140} height={140} className="h-10 w-auto sm:h-12" priority />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="text-sm font-medium text-marine-500 transition-colors hover:text-magenta-500"
            >
              {lien.libelle}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/espace" className="hidden text-sm font-medium text-marine-500 hover:text-magenta-500 sm:block">
            Espace client
          </Link>
          <Bouton href="/devis" taille="petit">
            Demander un devis
          </Bouton>
        </div>
      </div>
    </header>
  );
}
