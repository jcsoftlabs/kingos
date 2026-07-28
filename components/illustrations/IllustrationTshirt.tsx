/** Mockup de t-shirt plié, style aplat — tuile "Impression Textile". */
export function IllustrationTshirt() {
  return (
    <svg
      viewBox="0 0 220 160"
      className="pointer-events-none absolute -right-4 -top-4 h-40 w-56 opacity-90 sm:h-48 sm:w-64"
      aria-hidden
    >
      <path
        d="M78 34 60 44l-18 20 16 14 8-6v70h96V72l8 6 16-14-18-20-18-10c-4 8-14 14-26 14s-22-6-26-14Z"
        fill="white"
        fillOpacity="0.14"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* impression sur le t-shirt : anneaux du globe */}
      <circle cx="110" cy="96" r="22" stroke="white" strokeOpacity="0.5" strokeWidth="3" fill="none" />
      <path d="M92 90c10-8 26-8 36 0" stroke="white" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M90 104c12 8 28 8 40 0" stroke="white" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
