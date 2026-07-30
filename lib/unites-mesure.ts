// Les services en mode SURFACE se tarifient en pouces (voir tarification.ts
// côté backend) — ces unités ne servent qu'à la saisie côté staff/client,
// converties en pouces avant l'envoi à l'API (le contrat largeurPouces/
// hauteurPouces ne change pas).
export const UNITES_MESURE = [
  { valeur: "pouces", libelle: "Pouces", abrege: "po", versPoucesFacteur: 1 },
  { valeur: "pieds", libelle: "Pieds", abrege: "pi", versPoucesFacteur: 12 },
  { valeur: "metres", libelle: "Mètres", abrege: "m", versPoucesFacteur: 39.3701 },
  { valeur: "millimetres", libelle: "Millimètres", abrege: "mm", versPoucesFacteur: 0.0393701 },
  { valeur: "yards", libelle: "Yards", abrege: "yd", versPoucesFacteur: 36 },
] as const;

export type UniteMesure = (typeof UNITES_MESURE)[number]["valeur"];

export function versPouces(valeur: number, unite: UniteMesure): number {
  const u = UNITES_MESURE.find((u) => u.valeur === unite);
  return valeur * (u?.versPoucesFacteur ?? 1);
}

export function abregeUnite(unite: UniteMesure): string {
  return UNITES_MESURE.find((u) => u.valeur === unite)?.abrege ?? unite;
}

/** Surface en pieds carrés à partir de deux dimensions saisies dans la même unité. */
export function surfacePi2(hauteur: number, largeur: number, unite: UniteMesure): number {
  return (versPouces(hauteur, unite) * versPouces(largeur, unite)) / 144;
}
