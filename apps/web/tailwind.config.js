/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b1d3a',
          indigo: '#1e3a8a',
          blue: '#1d4ed8',
          teal: '#0d7a57',
          forest: '#065f46',
          saffron: '#e06714',
          orange: '#ea580c',
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          text: '#0f172a',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
