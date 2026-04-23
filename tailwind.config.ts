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
      },
      backgroundColor: {
        body: "#f5f7f4",
        dash: "#eef0ec",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
