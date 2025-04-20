import type { Config } from 'tailwindcss';

export default {
	darkMode: ['selector', 'class'],
	content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
				green: 'var(--color-green)',
				yellow: 'var(--color-yellow)',
				orange: 'var(--color-orange)',
				blue: 'hsl(var(--color-blue) / <alpha-value>)',
				darkgreen: 'var(--color-darkgreen)',
				'light-green': 'hsl(var(--color-light-green) / <alpha-value>)',
				sol_ok: 'var(--color-sol_ok)',
				sol_top: 'var(--color-sol_top)',
				sol_ko: 'var(--color-sol_ko)',
				select: 'var(--color-select)',
				grey: 'var(--color-grey)',
				gray: 'var(--color-gray)',
			},
			fontFamily: {
				verdana: ['var(--font-verdana)', 'sans-serif'],
				sans: ['var(--font-sans)', 'sans-serif'],
				serif: ['var(--font-serif)', 'serif'],
			},
			fontSize: {
				sm: 'var(--fontSize-Sm)',
				base: 'var(--fontSize-Base)',
				lg: 'var(--fontSize-Lg)',
				xl: 'var(--fontSize-Xl)',
			},
			lineHeight: {
				normal: 'var(--lineHeight-normal)',
				md: 'var(--lineHeight-md)',
				lg: 'var(--lineHeight-lg)',
				xl: 'var(--lineHeight-xl)',
				'2xl': 'var(--lineHeight-2xl)',
			},
			letterSpacing: {
				sm: 'var(--letterSpacing-sm)',
				lg: 'var(--letterSpacing-lg)',
			},
			spacing: {
				xs: 'var(--spacing-xs)',
				sm: 'var(--spacing-sm)',
				md: 'var(--spacing-md)',
				lg: 'var(--spacing-lg)',
				xl: 'var(--spacing-xl)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: {
				base: 'var(--boxShadow-base)',
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('tailwindcss-animate')],
} satisfies Config;
