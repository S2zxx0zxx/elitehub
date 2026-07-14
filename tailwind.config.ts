import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: 'var(--elite-white)',
        black: 'var(--bg-dark)',
        'bg-dark': 'var(--bg-dark)',
        'surface-dark': 'var(--surface-dark)',
        'bg-light': 'var(--bg-light)',
        'surface-light': 'var(--surface-light)',
        'elite-white': 'var(--elite-white)',
        'brand-yellow': 'var(--brand-yellow)',
        'yellow-deep': 'var(--yellow-deep)',
        'cta': 'var(--cta)',
        'gold': 'var(--gold)',
        'text-hi': 'var(--text-hi)',
        'text-lo': 'var(--text-lo)',
        success: 'var(--success)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        '24': '24px',
        '20': '20px',
        '14': '14px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
