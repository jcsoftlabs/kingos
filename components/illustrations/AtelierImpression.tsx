/**
 * Décor de l'écran de connexion du back-office : un atelier d'impression
 * grand format, dessiné en SVG plutôt que photographié — aucune dépendance
 * à une banque d'images, et le rendu suit la charte Kingo's.
 *
 * Pour utiliser une vraie photo à la place, déposer un fichier
 * public/atelier-impression.jpg : la page de connexion le préfère
 * automatiquement s'il existe.
 */
export function AtelierImpression({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="atelierFond" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#160F3F" />
          <stop offset="100%" stopColor="#0C0826" />
        </linearGradient>
        <linearGradient id="atelierBanniere1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6008C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E6008C" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="atelierBanniere2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00A0E6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00A0E6" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="atelierBanniere3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4E900" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#E4E900" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="atelierSortie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8F5DF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F8F5DF" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="atelierHalo" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#5F4EA0" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#5F4EA0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#atelierFond)" />
      <rect width="1200" height="800" fill="url(#atelierHalo)" />

      {/* Rail et bannières suspendues en séchage */}
      <line x1="90" y1="118" x2="1110" y2="118" stroke="#5F4EA0" strokeWidth="4" strokeOpacity="0.5" />
      <g>
        <rect x="150" y="122" width="150" height="290" rx="4" fill="url(#atelierBanniere1)" />
        <rect x="150" y="122" width="150" height="290" rx="4" stroke="#E6008C" strokeOpacity="0.35" />
        <rect x="176" y="168" width="98" height="9" rx="4.5" fill="#F8F5DF" fillOpacity="0.3" />
        <rect x="176" y="192" width="66" height="9" rx="4.5" fill="#F8F5DF" fillOpacity="0.2" />
        <circle cx="225" cy="290" r="42" fill="#F8F5DF" fillOpacity="0.12" />
      </g>
      <g>
        <rect x="345" y="122" width="132" height="228" rx="4" fill="url(#atelierBanniere2)" />
        <rect x="345" y="122" width="132" height="228" rx="4" stroke="#00A0E6" strokeOpacity="0.3" />
        <rect x="369" y="164" width="84" height="8" rx="4" fill="#F8F5DF" fillOpacity="0.28" />
        <rect x="369" y="185" width="54" height="8" rx="4" fill="#F8F5DF" fillOpacity="0.18" />
      </g>
      <g>
        <rect x="905" y="122" width="126" height="256" rx="4" fill="url(#atelierBanniere3)" />
        <rect x="905" y="122" width="126" height="256" rx="4" stroke="#E4E900" strokeOpacity="0.28" />
        <rect x="928" y="166" width="80" height="8" rx="4" fill="#F8F5DF" fillOpacity="0.26" />
      </g>

      {/* Traceur grand format */}
      <g>
        <rect x="520" y="392" width="430" height="128" rx="14" fill="#1A124B" stroke="#5F4EA0" strokeOpacity="0.55" strokeWidth="2" />
        <rect x="520" y="392" width="430" height="34" rx="14" fill="#5F4EA0" fillOpacity="0.28" />
        {/* Sortie papier imprimée */}
        <path d="M556 520 L914 520 L946 690 L524 690 Z" fill="url(#atelierSortie)" />
        <line x1="600" y1="560" x2="880" y2="560" stroke="#E6008C" strokeOpacity="0.4" strokeWidth="7" strokeLinecap="round" />
        <line x1="586" y1="600" x2="840" y2="600" stroke="#00A0E6" strokeOpacity="0.3" strokeWidth="7" strokeLinecap="round" />
        <line x1="572" y1="640" x2="800" y2="640" stroke="#E4E900" strokeOpacity="0.26" strokeWidth="7" strokeLinecap="round" />
        {/* Tête d'impression sur son axe */}
        <line x1="540" y1="452" x2="930" y2="452" stroke="#8F80C6" strokeOpacity="0.5" strokeWidth="3" />
        <rect x="700" y="436" width="56" height="34" rx="6" fill="#E6008C" fillOpacity="0.75" />
        {/* Pieds */}
        <rect x="560" y="690" width="16" height="70" rx="6" fill="#5F4EA0" fillOpacity="0.4" />
        <rect x="896" y="690" width="16" height="70" rx="6" fill="#5F4EA0" fillOpacity="0.4" />
      </g>

      {/* Rouleaux de vinyle en réserve */}
      <g opacity="0.85">
        <rect x="96" y="560" width="54" height="200" rx="27" fill="#5F4EA0" fillOpacity="0.3" />
        <ellipse cx="123" cy="560" rx="27" ry="11" fill="#8F80C6" fillOpacity="0.45" />
        <rect x="166" y="600" width="54" height="160" rx="27" fill="#5F4EA0" fillOpacity="0.22" />
        <ellipse cx="193" cy="600" rx="27" ry="11" fill="#8F80C6" fillOpacity="0.35" />
        <rect x="236" y="628" width="54" height="132" rx="27" fill="#5F4EA0" fillOpacity="0.16" />
        <ellipse cx="263" cy="628" rx="27" ry="11" fill="#8F80C6" fillOpacity="0.28" />
      </g>

      {/* Encres */}
      <g opacity="0.6">
        <rect x="1030" y="640" width="34" height="72" rx="8" fill="#E6008C" fillOpacity="0.45" />
        <rect x="1074" y="660" width="34" height="52" rx="8" fill="#00A0E6" fillOpacity="0.4" />
        <rect x="1118" y="676" width="34" height="36" rx="8" fill="#E4E900" fillOpacity="0.35" />
      </g>

      {/* Sol */}
      <rect y="760" width="1200" height="40" fill="#08051A" fillOpacity="0.85" />
    </svg>
  );
}
