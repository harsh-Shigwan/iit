/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        whitesmoke: "#f7fafc",
        "theme-white-default": "#fff",
        "theme-primary-dark": "#3754db",
        "theme-primary-default": "#4c6fff",
        "text-body-light": "#425466",
        "gray-200": "#edf2f9",
        f2d3d: "#1f2d3d",
        "border-light": "#edf2f7",
        black: "#000",
      },
      fontFamily: {
        "table-body-heading":"Inter",
      },
    },
  },
  plugins: [],
}