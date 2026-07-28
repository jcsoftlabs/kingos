"use client";

import Link from "next/link";
import { useState } from "react";

const LIENS = [
  { href: "/services", libelle: "Services" },
  { href: "/realisations", libelle: "Réalisations" },
  { href: "/ressources", libelle: "Ressources" },
  { href: "/a-propos", libelle: "À propos" },
  { href: "/contact", libelle: "Contact" },
  { href: "/espace", libelle: "Espace client" },
];

export function MenuMobile() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        aria-controls="menu-mobile"
        aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
        className="flex h-9 w-9 items-center justify-center rounded-full text-white"
      >
        <span className="relative block h-4 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform ${ouvert ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity ${ouvert ? "opacity-0" : ""}`} />
          <span
            className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition-transform ${ouvert ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </span>
      </button>

      {ouvert && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="absolute inset-x-0 top-full bg-marine-500 px-4 pb-6 pt-2">
          <ul className="space-y-1">
            {LIENS.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  onClick={() => setOuvert(false)}
                  className="block rounded-marque px-2 py-3 text-base font-bold text-creme-100 hover:bg-marine-600 hover:text-magenta-300"
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
