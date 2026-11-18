/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFC928',
          'yellow-soft': '#FFE58A',
          'yellow-deep': '#F5B800',
          green: '#168447',
          'green-hover': '#106B38',
          dark: '#111713',
          light: '#FFFDF5',
          text: '#17221A',
          muted: '#747B72',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(17,23,19,0.18)',
        lift: '0 24px 60px -20px rgba(17,23,19,0.28)',
        glow: '0 12px 32px -8px rgba(22,132,71,0.55)',
      },
      borderRadius: { '4xl': '2rem' },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        'spin-slow': 'spinSlow 40s linear infinite',
      },
    },
  },
  plugins: [],
};
