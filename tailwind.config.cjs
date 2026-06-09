/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.{js,ts,jsx,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        'deep-bg':    '#0D1117',
        'mid-bg':     '#161C24',
        'card-bg':    '#1C242E',
        'card-hover': '#222D3A',
        silver: {
          100: '#F0F4F8',
          200: '#C0C8D4',
          300: '#8FA3B8',
          400: '#5A6B7D',
        },
        gold: {
          DEFAULT: '#C9A84C',
          pure:    '#C9A84C',
          bright:  '#DDB96A',
          muted:   'rgba(201,168,76,0.12)',
          deep:    '#A07828',
          dim:     'rgba(201,168,76,0.15)',
          glow:    'rgba(201,168,76,0.3)',
        },
        teal:   { DEFAULT: '#22D3A5' },
        danger: { DEFAULT: '#FF5F72' },
        // Legacy compat
        bg: {
          base:    '#0D1117',
          surface: '#1C242E',
          muted:   '#161C24',
        },
        platinum: {
          100: 'rgba(192,200,212,0.08)',
          200: 'rgba(192,200,212,0.15)',
          300: 'rgba(192,200,212,0.30)',
          400: '#5A6B7D',
          500: '#8FA3B8',
          600: '#C0C8D4',
        },
        ink: {
          700: '#8FA3B8',
          800: '#C0C8D4',
          900: '#F0F4F8',
        },
        // Standard palette for component compat
        slate: {
          50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0',
          300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B',
          600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A',
        },
        rose: {
          50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF',
          400: '#FB7185', 500: '#F43F5E', 600: '#E11D48', 700: '#BE123C',
        },
        amber: {
          50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A',
          300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B',
          600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F',
        },
        blue: {
          50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD',
          400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
        },
        green: {
          50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC',
          400: '#4ADE80', 500: '#22C55E', 600: '#16A34A', 700: '#15803D',
        },
        violet: {
          50: '#F5F3FF', 100: '#EDE9FE', 600: '#7C3AED', 700: '#6D28D9',
        },
        purple: { 600: '#9333EA', 700: '#7E22CE' },
        yellow: { 400: '#FACC15', 500: '#EAB308' },
      },
      borderRadius: {
        'xl2': '28px',
        '3xl': '36px',
        '2xl': '1rem',
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.4)',
        'modal':  '0 4px 6px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.5)',
        'silver': '0 8px 24px rgba(192,200,212,0.2)',
        'gold':   '0 8px 24px rgba(201,168,76,0.28)',
        'btn':    '0 2px 8px rgba(0,0,0,0.3)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pageEnter: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(192,200,212,0.15)' },
          '50%':      { boxShadow: '0 0 20px 4px rgba(192,200,212,0.25)' },
        },
      },
      animation: {
        'page-enter':  'pageEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in':     'fade-in 0.4s ease forwards',
        'slide-in':    'slide-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'float-slow':  'float-slow 4s ease-in-out infinite',
        'glow-pulse':  'glow-pulse 3s ease-in-out infinite',
        'shimmer':     'shimmer 2s infinite',
      },
    }
  },
  plugins: [],
}
