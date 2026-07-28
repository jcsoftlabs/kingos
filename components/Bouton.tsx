import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variante = "primaire" | "secondaire" | "contour" | "contourClair" | "fantome";
type Taille = "normal" | "petit" | "grand";

interface ProprietesCommunes {
  variante?: Variante;
  taille?: Taille;
  className?: string;
  children: React.ReactNode;
}

// Pilules pleines ou détourées, dans l'esprit des CTA de référence — pas de coins carrés.
const STYLES_VARIANTE: Record<Variante, string> = {
  primaire:
    "bg-gradient-to-r from-magenta-500 to-magenta-400 text-white shadow-lg shadow-magenta-500/20 hover:shadow-magenta-500/30 hover:-translate-y-0.5 focus-visible:outline-magenta-500",
  secondaire: "bg-marine-500 text-white hover:bg-marine-600 focus-visible:outline-marine-500",
  contour: "border-2 border-marine-500 text-marine-500 hover:bg-marine-500 hover:text-white focus-visible:outline-marine-500",
  contourClair: "border-2 border-white/70 text-white hover:bg-white hover:text-marine-500 focus-visible:outline-white",
  fantome: "bg-transparent text-marine-500 hover:bg-marine-50 focus-visible:outline-marine-500",
};

const STYLES_TAILLE: Record<Taille, string> = {
  petit: "px-4 py-2 text-xs sm:text-sm",
  normal: "px-6 py-3 text-sm",
  grand: "px-8 py-4 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export function Bouton({
  href,
  variante = "primaire",
  taille = "normal",
  className = "",
  children,
  ...reste
}: ProprietesCommunes & ({ href: string } | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }))) {
  const classes = `${BASE} ${STYLES_VARIANTE[variante]} ${STYLES_TAILLE[taille]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(reste as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
