/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "monke-dark": "#0a0a0a",
        "monke-gray": "#1a1a1a",
        "monke-border": "#2a2a2a",
        "monke-text": "#e0e0e0",
        "monke-text-dim": "#888888",
        "monke-accent": "#ff8c00",
      },
      fontFamily: {
        monke: [
          "JetBrains Mono",
          "Fira Code",
          "Share Tech Mono",
          "Courier New",
          "monospace",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Share Tech Mono",
          "Courier New",
          "monospace",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "scale-up": "scaleUp 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
