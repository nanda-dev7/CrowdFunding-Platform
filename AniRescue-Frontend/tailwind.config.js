/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#ffffff",
        oat: "#f0f0f0",
        clay: "#a3a3a3",
        bark: "#555555",
        moss: "#111111",
        sage: "#f8f9fc",
        coral: "#e25c43",
        mist: "#fdece9",
        ink: "#111111",
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
