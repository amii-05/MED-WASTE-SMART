/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eedd1',
          400: '#2dd4bf',
          500: '#14b785',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134d4b',
          950: '#02302f'
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        accent: {
          50: '#fff1f0',
          500: '#ff4d4f',
          600: '#d92a2a',
          700: '#b01c1c'
        },
        success: {
          500: '#22c55e',
          600: '#16a34a'
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706'
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
