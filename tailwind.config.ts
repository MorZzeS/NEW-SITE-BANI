import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens
        wood: {
          50:  '#fdf8f0',
          100: '#f9edda',
          200: '#f0d5ad',
          300: '#e4b87a',
          400: '#d4914a',
          500: '#c4762e',
          600: '#a85e23',
          700: '#88461d',
          800: '#6e381c',
          900: '#5a2f1a',
        },
        graphite: {
          50:  '#f4f5f6',
          100: '#e4e6e8',
          200: '#c9cdd3',
          300: '#a2abb5',
          400: '#748290',
          500: '#596775',
          600: '#4a5563',
          700: '#3c4552',
          800: '#2d3440',
          900: '#1e2330',
          950: '#111520',
        },
        gold: {
          300: '#e8c97a',
          400: '#d4a843',
          500: '#c49430',
        },
        cream: 'rgb(var(--color-text-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '24px',
        xl: '40px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15)',
        'glass-lg': '0 16px 48px 0 rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.18)',
        'glass-sm': '0 4px 16px 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.12)',
        'gold': '0 4px 24px 0 rgba(196,148,48,0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'fade-in': 'fadeIn 0.5s ease both',
        'slide-in': 'slideIn 0.4s ease both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
