/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sb: {
          green: '#006241',
          accent: '#00754A',
          hover: '#005436',
          dark: '#1E3932',
          light: '#D4E9E2',
          soft: '#EAF3EF',
          cream: '#F2F0EB',
          gold: '#CBA258',
          goldLight: '#F7E7CE',
          slate: '#2D3748'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
