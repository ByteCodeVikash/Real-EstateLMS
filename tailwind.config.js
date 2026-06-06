/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        premium: {
          bg:       "#050505",   // Deep space black
          card:     "#0b0b0b",   // Rich charcoal black
          elevated: "#0f0f12",   // Slightly lifted surface
          border:   "#1a1a1c",   // Dark card borders
          accent:   "#D4AF37",   // Primary Gold
          gold:     "#D4AF37",
          'gold-light': "#E5C76B",
          'gold-dark':  "#CFAE5D",
          blue:     "#0A66C2",
          'blue-light': "#1E88E5",
          violet:   "#0A66C2",   // Alias: trust blue
          text:     "#c5c5c7",   // Premium silver gray body text
          muted:    "#606068",   // Dimmed label text
          heading:  "#ffffff",   // Elegant white headings
          dark:     "#050505",   // Deep contrasting black
          emerald:  "#10b981",   // Success green
          amber:    "#f59e0b",   // Warning amber
          red:      "#ef4444",   // Danger red
        }
      },
      backgroundImage: {
        'gradient-premium':    'linear-gradient(135deg, #CFAE5D 0%, #D4AF37 50%, #E5C76B 100%)',
        'gradient-violet':     'linear-gradient(135deg, #0A66C2 0%, #1E88E5 100%)',
        'gradient-dark':       'linear-gradient(180deg, #0f0f12 0%, #050505 100%)',
        'gradient-card':       'linear-gradient(135deg, #0b0b0d 0%, #080809 100%)',
        'gradient-gold-subtle':'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(229,199,107,0.03) 100%)',
        'gradient-blue-subtle':'linear-gradient(135deg, rgba(10,102,194,0.08) 0%, rgba(30,136,229,0.03) 100%)',
        'glass-gradient':      'linear-gradient(135deg, rgba(15,15,15,0.8) 0%, rgba(5,5,5,0.9) 100%)',
        'hero-gradient':       'radial-gradient(ellipse at top, rgba(10,102,194,0.12) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(212,175,55,0.08) 0%, transparent 50%)',
      },
      boxShadow: {
        'gold-sm':   '0 4px 16px rgba(212,175,55,0.12)',
        'gold-md':   '0 8px 32px rgba(212,175,55,0.18)',
        'gold-lg':   '0 16px 64px rgba(212,175,55,0.22)',
        'blue-sm':   '0 4px 16px rgba(10,102,194,0.12)',
        'blue-md':   '0 8px 32px rgba(10,102,194,0.18)',
        'dark-card': '0 4px 20px rgba(0,0,0,0.4)',
        'dark-lg':   '0 12px 48px rgba(0,0,0,0.55)',
        'dark-xl':   '0 24px 80px rgba(0,0,0,0.65)',
        'inner-gold': 'inset 0 1px 0 rgba(212,175,55,0.15)',
      },
      animation: {
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
        'float-fast':    'float 4s ease-in-out infinite 1.5s',
        'spin-slow':     'spin 12s linear infinite',
        'glow':          'glow 3s ease-in-out infinite',
        'slide-up':      'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-15px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
