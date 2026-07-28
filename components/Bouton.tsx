import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variante = "primaire" | "secondaire" | "fantome";
type Taille = "normal" | "petit";

interface ProprietesCommunes {
  variante?: Variante;
  taille?: Taille;
  className?: string;
  children: React.ReactNode;
}

const STYLES_VARIANTE: Record<Variante, string> = {
  primaire: "bg-magenta-500 text-white hover:bg-magenta-600 focus-visible:outline-magenta-500",
  secondaire: "bg-marine-500 text-white hover:bg-marine-600 focus-visible:outline-marine-500",
  fantome: "bg-transparent text-marine-500 hover:bg-marine-50 focus-visible:outline-marine-500",
};

const STYLES_TAILLE: Record<Taille, string> = {
  normal: "px-5 py-2.5 text-sm",
  petit: "px-4 py-2 text-xs sm:text-sm",
};

const BASE =
  "inline-flex items-center justify-center rounded-marque font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

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
