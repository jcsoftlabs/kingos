import Image from "next/image";
import Link from "next/link";
import { Bouton } from "./Bouton";
import { MenuMobile } from "./MenuMobile";

const LIENS = [
  { href: "/services", libelle: "Services" },
  { href: "/realisations", libelle: "Réalisations" },
  { href: "/ressources", libelle: "Ressources" },
  { href: "/a-propos", libelle: "À propos" },
  { href: "/contact", libelle: "Contact" },
];

export function Entete() {
  return (
    <header className="sticky top-0 z-40 bg-marine-500 print:hidden">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Accueil Kingo's">
          <Image
            src="/logo-kingos.png"
            alt="Kingo's"
            width={140}
            height={140}
            className="h-9 w-auto brightness-0 invert sm:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="text-sm font-bold text-creme-100 transition-colors hover:text-magenta-300"
            >
              {lien.libelle}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/espace"
            className="hidden text-sm font-bold text-creme-100 hover:text-magenta-300 sm:block"
          >
            Mon compte
          </Link>
          <Bouton href="/devis" taille="petit">
            Demander un devis
          </Bouton>
          <MenuMobile />
        </div>
      </div>
    </header>
  );
}
