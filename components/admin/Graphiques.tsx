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

export function RepartitionServices({
  services,
  masque,
}: {
  services: { serviceNom: string; caCents: string | null; quantite: number; commandes: number }[];
  masque: boolean;
}) {
  if (services.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-marine-400">Aucun service commandé pour l&apos;instant.</p>;
  }

  // Sans montants (rôle PRODUCTION), on classe par volume plutôt que par CA.
  const base = masque ? services.map((s) => s.quantite) : services.map((s) => Number(s.caCents ?? 0));
  const total = base.reduce((a, b) => a + b, 0) || 1;
  const COULEURS = ["bg-magenta-500", "bg-cyan-500", "bg-foret-500", "bg-marine-400", "bg-magenta-300", "bg-cyan-300"];

  return (
    <ul className="divide-y divide-marine-100">
      {services.map((s, i) => {
        const part = Math.round((base[i]! / total) * 100);
        return (
          <li key={s.serviceNom} className="px-5 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-sm font-medium text-marine-500">{s.serviceNom}</span>
              <span className="shrink-0 text-sm font-bold tabular-nums text-marine-500">
                {masque ? `${s.quantite} u.` : formaterHTG(s.caCents ?? 0)}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-marine-50">
                <span className={`block h-full rounded-full ${COULEURS[i % COULEURS.length]}`} style={{ width: `${part}%` }} />
              </span>
              <span className="w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-marine-400">{part}%</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
