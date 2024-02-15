import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        tall: { 'raw': '(min-height: 380px)'}
      }
    },
  },
  plugins: [],
};

export default config;
