/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0f0f0f",
        "dark-surface": "#1a1a1a",
        "dark-border": "#333333",
        "dark-text": "#ffffff",
        "dark-text-secondary": "#b3b3b3",
        "dark-accent": "#60a5fa",
        "dark-accent-hover": "#3b82f6",
        "dark-success": "#10b981",
        "dark-warning": "#f59e0b",
        "dark-error": "#ef4444",
      },
      fontFamily: {
        japanese: [
          "Noto Sans CJK JP",
          "Hiragino Sans",
          "Yu Gothic",
          "Meiryo",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};
