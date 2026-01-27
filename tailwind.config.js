/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50, #f0f9ff)',
          100: 'var(--primary-100, #e0f2fe)',
          200: 'var(--primary-200, #bae6fd)',
          300: 'var(--primary-300, #7dd3fc)',
          400: 'var(--primary-400, #38bdf8)',
          500: 'var(--primary-500, #0ea5e9)',
          600: 'var(--primary-600, #0284c7)',
          700: 'var(--primary-700, #0369a1)',
          800: 'var(--primary-800, #075985)',
          900: 'var(--primary-900, #0c4a6e)',
        },
      },
      animation: {
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
