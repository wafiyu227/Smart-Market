/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: "#183D32",
          ivory: "#F6F1E7",
          terracotta: "#C96F4A",
          charcoal: "#252923",
          sage: "#788477",
          sandstone: "#E7DFD0",
        },
      },
    },
  },
  plugins: [],
};
