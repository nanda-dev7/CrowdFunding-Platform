/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fbf5ea",
        oat: "#f2e3ce",
        clay: "#b8805d",
        bark: "#4f3527",
        moss: "#49705b",
        sage: "#dfeadf",
        coral: "#d96a5b",
        mist: "#e8fbfb",
        ink: "#251d18",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(79, 53, 39, 0.12)",
        card: "0 10px 32px rgba(37, 29, 24, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
