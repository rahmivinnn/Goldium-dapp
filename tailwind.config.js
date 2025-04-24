// default settings can be found here
// https://unpkg.com/browse/tailwindcss@2.2.17/stubs/defaultConfig.stub.js

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  theme: {
    extend: {
      colors: {
        'goldium': {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#FFC300', // Primary gold
          600: '#CC9C00',
          700: '#997500',
          800: '#664E00',
          900: '#332700',
        },
        'skyblue': {
          50: '#F0F8FF',
          100: '#E1F1FF',
          200: '#C3E3FF',
          300: '#A5D5FF',
          400: '#87C7FF',
          500: '#69B9FF', // Primary sky blue
          600: '#5494CC',
          700: '#3F6F99',
          800: '#2A4A66',
          900: '#152533',
        },
        'eggshell': {
          50: '#FFFDF7',
          100: '#FFFBEF',
          200: '#FFF7DF',
          300: '#FFF3CF',
          400: '#FFEFBF',
          500: '#FFEBAF', // Primary eggshell
          600: '#CCBC8C',
          700: '#998D69',
          800: '#665E46',
          900: '#332F23',
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  daisyui: {
    styled: true,
    themes: [
      {
        goldium: {
          "primary": "#FFC300",
          "primary-focus": "#CC9C00",
          "primary-content": "#ffffff",

          "secondary": "#69B9FF",
          "secondary-focus": "#5494CC",
          "secondary-content": "#ffffff",

          "accent": "#FFEBAF",
          "accent-focus": "#FFEFBF",
          "accent-content": "#332F23",

          "neutral": "#3D4451",
          "neutral-focus": "#2A2E37",
          "neutral-content": "#ffffff",

          "base-100": "#FFFFFF",
          "base-200": "#F9FAFB",
          "base-300": "#F3F4F6",
          "base-content": "#1F2937",

          "info": "#69B9FF",
          "success": "#87D039",
          "warning": "#FFC300",
          "error": "#FF5C5C",
        },
        goldium_dark: {
          "primary": "#FFC300",
          "primary-focus": "#CC9C00",
          "primary-content": "#ffffff",

          "secondary": "#69B9FF",
          "secondary-focus": "#5494CC",
          "secondary-content": "#ffffff",

          "accent": "#FFEBAF",
          "accent-focus": "#FFEFBF",
          "accent-content": "#332F23",

          "neutral": "#2A2E37",
          "neutral-focus": "#1F2937",
          "neutral-content": "#ffffff",

          "base-100": "#1F2937",
          "base-200": "#111827",
          "base-300": "#0F172A",
          "base-content": "#F9FAFB",

          "info": "#69B9FF",
          "success": "#87D039",
          "warning": "#FFC300",
          "error": "#FF5C5C",
        },
      },
      "night",
      "retro",
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
