/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#C67C4E',
        secondary: '#313131',

        background: '#B1F5BF', // canvas
        surface: '#FFFFFF',   // cards
        buttonBg: '#2B8761',  // CTA buttons

        textPrimary: '#1F2937',   // dark gray (Figma-like)
        textSecondary: '#6B7280', // muted text

        accent: '#F5A623',
      },
      fontFamily: {
        body: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      spacing: {
        '1.5': '0.375rem',  // 6px
        '2.5': '0.625rem',  // 10px
        '4.5': '1.125rem',  // 18px
        '7.5': '1.875rem',  // 30px
      },
      borderRadius: {
        card: '12px',
        button: '8px',
      },
    },
  },
  plugins: [],
};
