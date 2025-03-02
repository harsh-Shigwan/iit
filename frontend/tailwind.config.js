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
        "text-body-light": "#425466",
      },
      fontFamily: {
        "table-body-heading":"Inter",
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
        'zoom-in-out': 'zoom 2s ease-in-out infinite',
      },
            keyframes: {
        zoom: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },

    },
  },
  plugins: [],
}