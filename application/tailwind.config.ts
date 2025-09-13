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
				green: 'var(--color-green)',
				grey: 'var(--color-grey)',
				yellow: 'var(--color-yellow)',
				orange: 'var(--color-orange)',
				blue: 'hsl(var(--color-blue) / <alpha-value>)',
				darkgreen: 'var(--color-darkgreen)',
				sol_ok: 'var(--color-sol_ok)',
				sol_top: 'var(--color-sol_top)',
				sol_ko: 'var(--color-sol_ko)',
				select: 'var(--color-select)',
				gris: 'var(--color-gris)',
			},
			fontFamily: {
				sans: ['var(--font-sans)', 'sans-serif'],
				serif: ['var(--font-serif)', 'serif'],
			},
			fontSize: {
				sm: 'var(--fontSize-Sm)',
				base: 'var(--fontSize-Base)',
				lg: 'var(--fontSize-Lg)',
				xl: 'var(--fontSize-Xl)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: {
				base: 'var(--boxShadow-base)',
			},
			rotate: {
				'-12': '-12deg',
				'-30': '-30deg',
			},
			keyframes: {
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				'slide-in-bottom': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-in': {
					'0%': { transform: 'translate(-100%, 100%)', opacity: '0' },
					'100%': { transform: 'translate(0, 0)', opacity: '1' },
				},
			},
			animation: {
				'slide-in-right': 'slide-in-right 0.4s ease-out',
				'slide-in-bottom': 'slide-in-bottom 0.4s ease-out',
				'slide-in': 'slide-in 1.5s ease-out forwards',
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('tailwindcss-animate')],
} satisfies Config;
