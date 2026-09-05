/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0d0c",
        panel: "#111615",
        moss: "#b8c9a8",
        mint: "#d6e8bd",
        lime: "#c7eb92",
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 70px rgba(199, 235, 146, .13)",
      },
    },
  },
  plugins: [],
};
