// Formes minimales, alignées sur les réponses de l'API — pas de génération
// depuis Prisma côté frontend, ce serait coupler le site au schéma backend.

export type ModeTarification = "SURFACE" | "QUANTITE" | "FORFAIT" | "SUR_DEVIS";
export type TypeAttribut = "CHOIX" | "DIMENSION" | "NOMBRE" | "BOOLEEN" | "TEXTE";

export interface CategorieResume {
  id: string;
  slug: string;
  nom: string;
  services: { id: string; slug: string; nom: string; resume: string; mode: ModeTarification; unite: string | null; delaiJours: number }[];
}

export interface OptionAttribut {
  id: string;
  valeur: string;
  libelle: string;
  disponible: boolean;
}

export interface AttributService {
  id: string;
  cle: string;
  libelle: string;
  type: TypeAttribut;
  obligatoire: boolean;
  options: OptionAttribut[];
}

export interface ServiceDetail {
  id: string;
  slug: string;
  nom: string;
  description: string;
  mode: ModeTarification;
  unite: string | null;
  quantiteMin: number;
  quantiteMax: number | null;
  surfaceMinFt2: string | null;
  surfaceMaxFt2: string | null;
  delaiJours: number;
  attributs: AttributService[];
  categorie: { nom: string; slug: string };
}

export interface EtapeCalcul {
  libelle: string;
  valeur: string;
}

export interface ResultatSimulation {
  mode: ModeTarification;
  etapes: EtapeCalcul[];
  prixUnitaireCents: string;
  totalCents: string;
}

export function formaterHTG(centimes: string | number) {
  const montant = Number(centimes) / 100;
  // Intl affiche "G" comme symbole CLDR de la gourde — l'utilisateur veut "HTG" en toutes lettres.
  return `${new Intl.NumberFormat("fr-HT", { maximumFractionDigits: 0 }).format(montant)} HTG`;
}
