/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#4CAF50", // Fresh Green
            dark: "#388E3C",
            light: "#C8E6C9",
          },
          accent: {
            orange: "#F57C00", // Warm Orange
            yellow: "#FFC107", // Golden Yellow
            purple: "#673AB7", // Deep Purple
          },
          neutral: {
            white: "#FAFAFA", // Soft White
            brown: "#795548", // Earthy Brown
            olive: "#8D8D6E", // Muted Olive
          },
        },
      },
    },
    plugins: [],
  }