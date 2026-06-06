import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "forest-deep": "#1F3A2F",
        moss: "#4A6B5C",
        "sage-mist": "#B8C5B0",
        brass: "#C9A961",
        bone: "#F5F1E8",
        parchment: "#EDE5D3",
        charcoal: "#1A1A1A",
        ink: "#3A3A3A",
        coral: "#E07856",
        "amber-warn": "#D4A04C",
        verified: "#5A8A6B",
        "ink-blue": "#2C3E50",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-xl": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        compass:
          "0 4px 24px -8px rgba(31, 58, 47, 0.15), 0 2px 8px -2px rgba(31, 58, 47, 0.1)",
        "compass-lg":
          "0 12px 48px -12px rgba(31, 58, 47, 0.25), 0 4px 16px -4px rgba(31, 58, 47, 0.15)",
        "brass-glow":
          "0 0 0 1px #C9A961, 0 4px 16px -4px rgba(201, 169, 97, 0.4)",
      },
      backgroundImage: {
        "grid-pattern": "radial-gradient(circle, #B8C5B0 1px, transparent 1px)",
        "gradient-forest": "linear-gradient(135deg, #1F3A2F 0%, #4A6B5C 100%)",
      },
      animation: {
        "compass-spin": "compass-spin 2s ease-in-out infinite",
        "needle-wobble": "needle-wobble 4s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        "compass-spin": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
        },
        "needle-wobble": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
}
export default config
