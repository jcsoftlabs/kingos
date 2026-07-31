import { formaterHTG } from "@/lib/types-catalogue";

/**
 * Graphiques dessinés à la main en SVG — aucune librairie de charting ajoutée
 * au bundle pour deux visualisations, et le rendu reste 100 % côté serveur.
 */

const MOIS_COURTS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

function libelleMois(cle: string) {
  const mois = Number(cle.split("-")[1]);
  return MOIS_COURTS[mois - 1] ?? cle;
}

// Abrégé pour l'axe vertical ("150 k HTG" plutôt que "150 000,00 HTG") —
// la valeur complète reste lisible au survol de chaque point (title).
function libelleAxe(gourdes: number): string {
  if (gourdes >= 1000) return `${(gourdes / 1000).toLocaleString("fr-HT", { maximumFractionDigits: 1 })} k`;
  return gourdes.toLocaleString("fr-HT", { maximumFractionDigits: 0 });
}

export function CourbeChiffreAffaires({ donnees }: { donnees: { mois: string; caCents: string | null }[] }) {
  const valeurs = donnees.map((d) => Number(d.caCents ?? 0) / 100);
  const max = Math.max(...valeurs, 1);
  const padGauche = 52;
  const padDroite = 8;
  const largeur = 640;
  const hauteur = 180;
  const largeurTrace = largeur - padGauche - padDroite;
  const pas = valeurs.length > 1 ? largeurTrace / (valeurs.length - 1) : 0;

  const points = valeurs.map((v, i) => {
    const x = padGauche + i * pas;
    const y = hauteur - (v / max) * (hauteur - 24) - 8;
    return { x, y, v };
  });

  const ligne = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const aire = `${ligne} L ${points[points.length - 1]?.x.toFixed(1)} ${hauteur} L ${points[0]?.x.toFixed(1)} ${hauteur} Z`;
  const totalNul = valeurs.every((v) => v === 0);

  return (
    <div>
      <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="h-44 w-full" role="img" aria-label="Chiffre d'affaires sur 12 mois">
        <defs>
          <linearGradient id="degradeCa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E6008C" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#E6008C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = hauteur - f * (hauteur - 24) - 8;
          return (
            <g key={f}>
              <line x1={padGauche} y1={y} x2={largeur} y2={y} stroke="#DAD4EC" strokeWidth="1" strokeDasharray="3 4" />
              <text x={padGauche - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="10" fontWeight="600" fill="#8F80C6">
                {libelleAxe(max * f)}
              </text>
            </g>
          );
        })}

        {!totalNul && (
          <>
            <path d={aire} fill="url(#degradeCa)" />
            <path d={ligne} fill="none" stroke="#E6008C" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#E6008C" strokeWidth="2">
                <title>{`${libelleMois(donnees[i]!.mois)} — ${formaterHTG(Math.round(p.v * 100))}`}</title>
              </circle>
            ))}
          </>
        )}
      </svg>

      <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase text-marine-300" style={{ paddingLeft: `${(padGauche / largeur) * 100}%`, paddingRight: `${(padDroite / largeur) * 100}%` }}>
        {donnees.map((d) => (
          <span key={d.mois}>{libelleMois(d.mois)}</span>
        ))}
      </div>
    </div>
  );
}

export interface SegmentDonut {
  libelle: string;
  valeur: number;
  couleur: string;
  /** Formaté par l'appelant : montant en gourdes, nombre d'unités… */
  affichage: string;
}

/**
 * Anneau proportionnel — un arc par segment, tracé avec stroke-dasharray sur
 * un cercle plutôt qu'avec des chemins calculés à la main (moins de
 * trigonométrie, et les arcs restent nets à n'importe quelle taille).
 */
export function Donut({
  segments,
  libelleCentre,
  valeurCentre,
}: {
  segments: SegmentDonut[];
  libelleCentre: string;
  valeurCentre: string;
}) {
  const total = segments.reduce((acc, s) => acc + s.valeur, 0);
  const rayon = 60;
  const circonference = 2 * Math.PI * rayon;
  let cumul = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0" role="img" aria-label={libelleCentre}>
        <g transform="rotate(-90 80 80)">
          <circle cx="80" cy="80" r={rayon} fill="none" stroke="#F0EEF8" strokeWidth="20" />
          {total > 0 &&
            segments.map((s) => {
              const part = s.valeur / total;
              const arc = part * circonference;
              const decalage = -cumul * circonference;
              cumul += part;
              if (s.valeur === 0) return null;
              return (
                <circle
                  key={s.libelle}
                  cx="80"
                  cy="80"
                  r={rayon}
                  fill="none"
                  stroke={s.couleur}
                  strokeWidth="20"
                  strokeDasharray={`${arc.toFixed(2)} ${circonference.toFixed(2)}`}
                  strokeDashoffset={decalage.toFixed(2)}
                />
              );
            })}
        </g>
        <text x="80" y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="#8F80C6" letterSpacing="0.5">
          {libelleCentre.toUpperCase()}
        </text>
        <text x="80" y="92" textAnchor="middle" fontSize="15" fontWeight="800" fill="#1A124B">
          {valeurCentre}
        </text>
      </svg>

      <ul className="w-full space-y-2.5">
        {segments.map((s) => {
          const part = total > 0 ? Math.round((s.valeur / total) * 100) : 0;
          return (
            <li key={s.libelle} className="flex items-baseline gap-2.5">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.couleur }} />
              <span className="flex-1 truncate text-sm text-marine-500">{s.libelle}</span>
              <span className="shrink-0 text-sm font-bold tabular-nums text-marine-500">{s.affichage}</span>
              <span className="w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-marine-400">{part}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
