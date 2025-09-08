/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        'japanese': ['Noto Sans JP', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'zen': '0.15em',
      },
      lineHeight: {
        'zen': '2',
      },
      boxShadow: {
        'zen': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'zen-hover': '0 16px 48px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};