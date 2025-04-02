import type { Config } from "tailwindcss";

export default {
  darkMode: "selector",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        'sol-ok': "var(--sol-ok)",
        'sol-top': "var(--sol-top)",
        'sol-ko': "var(--sol-ko)",
		'BG-darkmode':"var(--BG-darkmode)",
		'light-green': "var(--light-green)",
		'gray': "var(--gray)",
		'dark-green': "var(--dark-green)",
		'gray-light-bg': "var(--gray-light-bg)",
		'select': "var(--select)",
      },
      fontFamily: {
        verdana: ["var(--verdana)", "open-sans"],
      },
	  fontSize:{
		sm: "var(--fontSize-Sm)",
		base: "var(--fontSize-Base)",
		lg:'var(--fontSize-Lg)',
		xl:'var(--fontSize-Xl)',
	  },
	  lineHeight:{
		normal:'var(--lineHeight-normal)',
		md:'var(--lineHeight-md)',
		lg:'var(--lineHeight-lg)',
		xl:'var(--lineHeight-xl)',
		'2xl':'var(--lineHeight-2xl)',
	  },
	  letterSpacing: {
		sm: '-3%',
		lg: '50%',
	  },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      borderRadius: {},
	  boxShadow: {
		'base': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
	  }
    },
  },
  plugins: [],
} satisfies Config;

