/** Pile de fichiers téléchargeables, style aplat — tuile "Ressources Graphiques". */
export function IllustrationDossier() {
  return (
    <svg
      viewBox="0 0 220 160"
      className="pointer-events-none absolute -right-4 -top-4 h-40 w-56 opacity-90 sm:h-48 sm:w-64"
      aria-hidden
    >
      <rect x="40" y="70" width="90" height="60" rx="4" fill="#1A124B" fillOpacity="0.08" stroke="#1A124B" strokeOpacity="0.35" strokeWidth="2" />
      <rect x="58" y="52" width="90" height="60" rx="4" fill="#1A124B" fillOpacity="0.12" stroke="#1A124B" strokeOpacity="0.45" strokeWidth="2" />
      <rect x="76" y="34" width="90" height="60" rx="4" fill="#1A124B" fillOpacity="0.18" stroke="#1A124B" strokeOpacity="0.6" strokeWidth="2" />
      <text x="121" y="70" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1A124B" fillOpacity="0.7" fontFamily="inherit">
        .AI
      </text>
      <path d="M108 74v18m-8-8 8 8 8-8" stroke="#1A124B" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
