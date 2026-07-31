import type { SVGProps } from "react";

/** Icônes de navigation du back-office — même style trait que components/icones/index.tsx. */
type Props = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconeTableauDeBord(props: Props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function IconePanier(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l2.2 10.5a2 2 0 0 0 2 1.5h7.4a2 2 0 0 0 2-1.6L20 8H6" />
      <circle cx="10" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
    </svg>
  );
}

export function IconeDevis(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v4h4" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

export function IconeFacture(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 2h14v20l-2.5-1.5L14 22l-2-1.5L10 22l-2.5-1.5L5 22z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

export function IconeCatalogue(props: Props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconeUtilisateurs(props: Props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 5.6" />
      <path d="M17.5 14.3A6.5 6.5 0 0 1 21.5 20" />
    </svg>
  );
}

export function IconeClients(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21v-1.5A4.5 4.5 0 0 1 8.5 15h3A4.5 4.5 0 0 1 16 19.5V21" />
      <circle cx="10" cy="8" r="4" />
      <path d="M18.5 12.5 20 14l3-3" />
    </svg>
  );
}

export function IconeReglages(props: Props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </svg>
  );
}

export function IconeTendance(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M15 8h5v5" />
    </svg>
  );
}

export function IconeHorloge(props: Props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconeAlerte(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 2.5 20h19z" />
      <path d="M12 9v5M12 17.5v.01" />
    </svg>
  );
}

export function IconeCheque(props: Props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h5" />
      <circle cx="17" cy="15" r="2" />
    </svg>
  );
}

export function IconeRealisations(props: Props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="m3 14 5-5 4 4 5-6 4 4" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}

export function IconeRessources(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 2h9l4 4v16H6z" />
      <path d="M15 2v4h4" />
      <path d="M9 17V9l3 2 3-2v8" />
    </svg>
  );
}

export function IconeJournal(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 2h12v20H6z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

export function IconeSupport(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4h16v12H8l-4 4z" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  );
}

export function IconeDeconnexion(props: Props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
