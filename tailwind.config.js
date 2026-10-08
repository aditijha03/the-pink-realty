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
        // Semantic tokens
        background: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-elevated': 'var(--surface-elevated)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        // Pink
        pink: {
          DEFAULT: 'var(--pink)',
          hover: 'var(--pink-hover)',
          button: 'var(--pink-button)',
          'button-hover': 'var(--pink-button-hover)',
          light: 'var(--pink-light)',
          glow: 'var(--glow)',
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 30px var(--glow)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        heroshimmer: {
          '0%, 83%': { transform: 'translateX(-100%)', opacity: '0' },
          '84%': { opacity: '1' },
          '100%': { transform: 'translateX(200%)', opacity: '0' },
        },
        'intro-logo': {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'intro-line': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'intro-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        'shimmer': 'shimmer 6s linear infinite',
        'heroshimmer': 'heroshimmer 6s ease-in-out infinite',
        'intro-logo': 'intro-logo 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'intro-line': 'intro-line 0.8s ease-out forwards',
        'intro-shimmer': 'intro-shimmer 1.5s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}
