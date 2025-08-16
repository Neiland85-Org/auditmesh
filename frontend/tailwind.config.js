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
        // AuditMesh Brand Colors
        primary: {
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          950: 'hsl(var(--primary-950))',
        },
        // Brand colors for the new design
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#b7ddff',
          300: '#88c8ff',
          400: '#57adff',
          500: '#2d8fff',
          600: '#1e72f0',
          700: '#195bd1',
          800: '#184ba8',
          900: '#173f86',
        },
        // Service-specific colors
        gateway: {
          500: 'hsl(var(--gateway-500))',
          600: 'hsl(var(--gateway-600))',
        },
        detector: {
          500: 'hsl(var(--detector-500))',
          600: 'hsl(var(--detector-600))',
        },
        auditor: {
          500: 'hsl(var(--auditor-500))',
          600: 'hsl(var(--auditor-600))',
        },
        // Background colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        cardForeground: 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        popoverForeground: 'hsl(var(--popover-foreground))',
        muted: 'hsl(var(--muted))',
        mutedForeground: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        accentForeground: 'hsl(var(--accent-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px hsl(var(--primary-500))' },
          '100%': { boxShadow: '0 0 30px hsl(var(--primary-500)), 0 0 40px hsl(var(--primary-500))' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'grid': 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)',
      },
      boxShadow: {
        'glow': '0 0 40px 8px rgba(45,143,255,0.25)',
        'glow-sm': '0 0 20px 4px rgba(45,143,255,0.15)',
        'glow-lg': '0 0 60px 12px rgba(45,143,255,0.35)',
      },
    },
  },
  plugins: [],
}
