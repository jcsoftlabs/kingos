/**
 * Grand dispositif graphique reprenant les anneaux du globe du logo — remplace
 * la simple carte "logo dans un cadre dégradé" par quelque chose de plus vivant :
 * anneaux excentrés, points en orbite, dans la palette de marque.
 */
export function IllustrationOrbite() {
  return (
    <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" aria-hidden>
      <circle cx="300" cy="300" r="260" stroke="#F8F5DF" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
      <circle cx="300" cy="300" r="205" stroke="#E4E900" strokeOpacity="0.35" strokeWidth="2" fill="none" />
      <circle cx="300" cy="300" r="150" stroke="#00A0E6" strokeOpacity="0.4" strokeWidth="2.5" fill="none" />
      <circle cx="300" cy="300" r="95" stroke="#E6008C" strokeOpacity="0.5" strokeWidth="3" fill="none" />

      <circle cx="300" cy="40" r="6" fill="#E4E900" />
      <circle cx="520" cy="300" r="7" fill="#00A0E6" />
      <circle cx="300" cy="560" r="5" fill="#E6008C" />
      <circle cx="95" cy="205" r="4" fill="#1E643C" />
      <circle cx="490" cy="150" r="4" fill="#F8F5DF" fillOpacity="0.7" />
    </svg>
  );
}
