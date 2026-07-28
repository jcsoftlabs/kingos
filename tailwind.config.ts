import type { Config } from "tailwindcss";

/**
 * Palette extraite directement du logo Kingo's (kingos-logo-png_seeklogo.png) —
 * le wordmark navy et le globe rayé qui remplace le « O ». Voir plan §5.2 :
 * la charte graphique est dérivée du logo, validée en phase 1.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        marine: {
          DEFAULT: "#1A124B", // navy du wordmark — texte, fond des sections sombres
          50: "#F0EEF8",
          100: "#DAD4EC",
          200: "#B5AAD9",
          300: "#8F80C6",
          400: "#5F4EA0",
          500: "#1A124B",
          600: "#160F3F",
          700: "#110C33",
          800: "#0C0826",
          900: "#08051A",
          950: "#050310",
        },
        magenta: {
          DEFAULT: "#E6008C", // pointe rose du globe — CTA, accents
          50: "#FDE6F4",
          100: "#FBCCE9",
          200: "#F899D3",
          300: "#F466BD",
          400: "#EE33A0",
          500: "#E6008C",
          600: "#B80070",
          700: "#8A0054",
          800: "#5C0038",
          900: "#2E001C",
        },
        cyan: {
          DEFAULT: "#00A0E6", // bande bleue du globe — liens, secondaire
          50: "#E6F6FD",
          100: "#CCEDFB",
          200: "#99DBF7",
          300: "#66C9F3",
          400: "#33B7EE",
          500: "#00A0E6",
          600: "#0080B8",
          700: "#00608A",
          800: "#00405C",
          900: "#00202E",
        },
        lime: {
          DEFAULT: "#E4E900", // bande jaune-vert du globe — alertes positives, mise en avant
          50: "#FCFDE0",
          100: "#F8FAC2",
          200: "#F2F585",
          300: "#EBF048",
          400: "#E6EC1A",
          500: "#E4E900",
          600: "#B6BA00",
          700: "#898C00",
          800: "#5B5D00",
          900: "#2E2F00",
        },
        foret: {
          DEFAULT: "#1E643C", // bande verte du globe — succès, badges
          50: "#E8F3EC",
          100: "#C6E1D0",
          200: "#8FC3A5",
          300: "#59A57A",
          400: "#2C8154",
          500: "#1E643C",
          600: "#185030",
          700: "#123C24",
          800: "#0C2818",
          900: "#06140C",
        },
        creme: {
          DEFAULT: "#F8F5DF", // bande crème du globe — fonds clairs, cartes
          100: "#FFFDF6",
          200: "#F8F5DF",
          300: "#EFE9C4",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        affiche: ["var(--font-affiche)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        marque: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;
