import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8f1",
          100: "#feeedb",
          200: "#fddbb7",
          300: "#fbc188",
          400: "#f79e54",
          500: "#f37a2b",
          600: "#e45e1f",
          700: "#bd451a",
          800: "#96381c",
          900: "#792f1b",
          950: "#41150c",
        },
        chef: {
          gold: "#D4AF37",
          copper: "#B87333",
          emerald: "#10B981",
          charcoal: "#1A1A1E",
          dark: "#0F1015",
          card: "#181920",
          border: "#2A2B35",
        },
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(243, 122, 43, 0.3)",
        "glow-gold": "0 0 25px -5px rgba(212, 175, 55, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
