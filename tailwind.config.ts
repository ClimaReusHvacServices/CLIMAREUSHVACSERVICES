import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Verde esmeralda — acción principal, botones, CTAs
        primary: {
          50:  "#f0faf5",
          100: "#d4f0e3",
          200: "#a8e1c8",
          300: "#72c9a8",
          400: "#3aaa83",
          500: "#008f65",
          600: "#00674F",
          700: "#005240",
          800: "#003d30",
          900: "#002920",
        },
        // Azul cerúleo — acentos, links, elementos secundarios
        accent: {
          50:  "#f0f8fc",
          100: "#daeef7",
          200: "#b5ddef",
          300: "#84c8e4",
          400: "#4CAAC9",
          500: "#2d8fb0",
          600: "#1d7291",
          700: "#185d77",
          800: "#124e63",
          900: "#0d3c4d",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
