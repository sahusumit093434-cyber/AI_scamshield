/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberdark: {
          DEFAULT: '#080C14',
          card: '#0F1626',
          input: '#151F32',
          border: '#1F2E4B',
        },
        cyber: {
          blue: '#00D8F6',
          purple: '#A855F7',
          red: '#EF4444',
          green: '#22C55E',
          yellow: '#EAB308',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgba(0, 216, 246, 0.25)',
        'glow-purple': '0 0 15px rgba(168, 85, 247, 0.25)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.25)',
      }
    },
  },
  plugins: [],
}
