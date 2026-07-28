import type { SVGProps } from "react";

/**
 * Icônes trait, dessinées à la main (aucun générateur d'image disponible —
 * voir la discussion produit). Style cohérent : stroke 2px, coins arrondis,
 * viewBox 24x24, couleur héritée via currentColor.
 */
type Props = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconeEclair(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

export function IconeCurseur(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 3v13l3.5-3L10 18l2.5-1L10 12h4L4 3Z" />
      <path d="M15 15v5" strokeDasharray="0.1 3" />
    </svg>
  );
}

export function IconeTelephone(props: Props) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
      <path d="m8 9 2 2 5-5" />
    </svg>
  );
}

export function IconeDocument(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 2h9l3 3v17H6Z" />
      <path d="M15 2v3h3" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

export function IconeTelechargement(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  );
}

export function IconeRadar(props: Props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" strokeDasharray="1 3" />
      <path d="M12 12 18 8" />
    </svg>
  );
}
