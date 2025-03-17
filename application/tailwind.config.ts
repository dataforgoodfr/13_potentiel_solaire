import type { Config } from 'tailwindcss';

export default {
	darkMode: 'selector',
	content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				accent: 'var(--color-accent)',
			},
			fontFamily: {
				sans: ['var(--font-sans)', 'sans-serif'],
				serif: ['var(--font-serif)', 'serif'],
			},
			spacing: {
				xs: '0.5rem',
				sm: '1rem',
				md: '1.5rem',
				lg: '2rem',
				xl: '3rem',
			},
			borderRadius: {},
		},
	},
	plugins: [],
} satisfies Config;
