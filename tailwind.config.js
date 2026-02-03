/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
          600: 'rgb(var(--color-primary) / <alpha-value>)',
          700: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        },
        'theme-start': 'var(--color-bg-start)',
        'theme-end': 'var(--color-bg-end)',
        'theme-glass': 'var(--color-glass)',
        'theme-input': 'var(--color-input-bg)',
        'theme-base': 'var(--color-text)',
        'theme-muted': 'var(--color-text-muted)',
        'theme-glass-border': 'var(--color-glass-border)',
        'theme-input-border': 'var(--color-input-border)',
      },
    },
  },
  plugins: [],
};
