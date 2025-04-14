import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      barlow: "var(--font-barlow)",
    },
  },
  plugins: [],
};

export default config;