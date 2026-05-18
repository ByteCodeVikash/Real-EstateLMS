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
          bg: "#f8fafc",         // Soft white/slate background
          card: "#ffffff",       // Pure white cards
          border: "#e2e8f0",     // Slate-200 border
          accent: "#2563eb",     // Sapphire blue
          violet: "#7c3aed",     // Subtle violet accent
          text: "#475569",       // Medium slate gray body text
          heading: "#0f172a",    // Dark slate headings
          dark: "#0b1224",       // Deep contrasting navy blue (for footer/hero/sidebar contrast)
          emerald: "#10b981",    // Success green
        }
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', // EdTech sapphire blue
        'gradient-violet': 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',   // Elegant violet highlight
        'gradient-dark': 'linear-gradient(180deg, #152238 0%, #0b1224 100%)',     // Deep navy gradient
        'gradient-light': 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',    // Soft light section bg
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    },
  },
  plugins: [],
}

