import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00d4ff',
          purple: '#b026ff',
          pink: '#ff006e',
          green: '#00ff88',
          yellow: '#ffea00',
        },
        dark: {
          bg: '#0a0a0f',
          surface: '#141420',
          elevated: '#1c1c2e',
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.6)',
        'neon-purple': '0 0 20px rgba(176, 38, 255, 0.6)',
        'neon-pink': '0 0 20px rgba(255, 0, 110, 0.6)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.6)',
      },
      backgroundImage: {
        'glow-gradient': 'linear-gradient(135deg, #00d4ff 0%, #b026ff 50%, #ff006e 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #141420 50%, #1c1c2e 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
