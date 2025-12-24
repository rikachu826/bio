/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired color palette with blue theme
        'space-black': '#0a0a0a',
        'charcoal': '#1c1c1e',
        'soft-gray': '#8e8e93',
        'light-gray': '#c7c7cc',
        'off-white': '#f2f2f7',
        'pure-white': '#ffffff',
        // Blue → Baby Blue → Teal gradient
        'ocean-blue': '#0066cc',
        'sky-blue': '#4facfe',
        'baby-blue': '#89cff0',
        'aqua': '#5fd3f3',
        'teal': '#00d4aa',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        'hero': ['clamp(3rem, 10vw, 7rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'section-title': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.2', fontWeight: '600' }],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-soft': 'pulse-soft 2.6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(118, 75, 162, 0.8)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.75' },
          '50%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #0066cc 0%, #4facfe 33%, #89cff0 66%, #00d4aa 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0a 0%, #1c1c1e 100%)',
        'gradient-glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
