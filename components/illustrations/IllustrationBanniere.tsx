/** Mockup de banner grand format, style aplat — tuile "Impression Grand Format". */
export function IllustrationBanniere() {
  return (
    <svg
      viewBox="0 0 220 160"
      className="pointer-events-none absolute -right-4 -top-4 h-40 w-56 opacity-90 sm:h-48 sm:w-64"
      aria-hidden
    >
      <rect x="18" y="24" width="184" height="96" rx="4" fill="white" fillOpacity="0.12" />
      <rect x="18" y="24" width="184" height="96" rx="4" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
      {/* poteaux */}
      <line x1="30" y1="120" x2="30" y2="146" stroke="white" strokeOpacity="0.5" strokeWidth="3" />
      <line x1="190" y1="120" x2="190" y2="146" stroke="white" strokeOpacity="0.5" strokeWidth="3" />
      {/* œillets */}
      {[34, 78, 122, 166].map((x) => (
        <circle key={x} cx={x} cy="32" r="3.5" fill="white" fillOpacity="0.6" />
      ))}
      {/* bandes graphiques à l'intérieur, écho du globe du logo */}
      <path d="M34 92c30-22 60-22 152 0" stroke="white" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M34 72c30-16 60-16 152 0" stroke="white" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
