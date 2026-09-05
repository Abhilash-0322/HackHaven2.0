/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18342f",
        sage: "#a8c6ad",
        mint: "#e8f0e8",
        paper: "#f7f9f7",
        coral: "#e78361",
        lilac: "#ebe7f2",
        moss: "#547866",
      },
      fontFamily: {
        display: ["DM Sans", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(24, 52, 47, 0.08)",
        card: "0 8px 30px rgba(24, 52, 47, 0.06)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
