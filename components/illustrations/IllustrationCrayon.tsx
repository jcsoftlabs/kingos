/** Plume + planches de dessin, style aplat — tuile "Conception Graphique". */
export function IllustrationCrayon() {
  return (
    <svg
      viewBox="0 0 220 160"
      className="pointer-events-none absolute -right-4 -top-4 h-40 w-56 opacity-90 sm:h-48 sm:w-64"
      aria-hidden
    >
      <rect x="30" y="30" width="70" height="90" rx="3" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
      <rect x="60" y="52" width="80" height="90" rx="3" fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.6" strokeWidth="2" />
      <circle cx="100" cy="97" r="18" stroke="white" strokeOpacity="0.6" strokeWidth="2.5" fill="none" />
      <path d="M75 130h50M75 118h30" stroke="white" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
      {/* plume */}
      <path
        d="m168 40-56 56 6 14 14 6 56-56c4-4 4-12-2-18l-0-0c-6-6-14-6-18-2Z"
        fill="white"
        fillOpacity="0.2"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="m118 96 6 14 14 6" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
