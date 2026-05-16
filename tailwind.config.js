/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        premium: {
          dark: "#0a0a0b",
          card: "#121214",
          border: "#1f1f23",
          accent: "#7c3aed",
          "accent-light": "#a78bfa",
          text: "#94a3b8",
          heading: "#f8fafc"
        }
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
        'gradient-dark': 'linear-gradient(180deg, #121214 0%, #0a0a0b 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
