import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// White Theme Brand Colors
				brand: {
					primary: '#007AFF',     /* Blue */
					secondary: '#5856D6',   /* Purple-blue */
					accent: '#34C759',      /* Green */
					success: '#34C759',     /* Green */
					warning: '#FF9500',     /* Orange */
					danger: '#FF3B30',      /* Red */
					info: '#007AFF',        /* Blue */
					light: '#1C1C1C',       /* Dark text */
					medium: '#4A4A4A',      /* Medium text */
					muted: '#6B7280',       /* Muted text */
					yellow: '#FFCC00',      /* Yellow */
				},
				// Light Background Colors
				bg: {
					primary: '#FFFFFF',     /* Pure white */
					secondary: '#F8F9FA',   /* Very light gray */
					tertiary: '#F1F3F4',    /* Light gray */
					surface: '#FFFFFF',     /* White surfaces */
				},
				// Colorful Text Colors
				text: {
					primary: '#1C1C1C',     /* Dark gray text */
					secondary: '#4A4A4A',   /* Medium gray text */
					muted: '#6B7280',       /* Light gray text */
					blue: '#007AFF',        /* Blue accent text */
					yellow: '#FFCC00',      /* Yellow accent text */
					orange: '#FF9500',      /* Orange accent text */
					green: '#34C759',       /* Green accent text */
				},
				// Light Border Colors
				'border-custom': {
					primary: '#E5E7EB',     /* Light borders */
					secondary: '#D1D5DB',   /* Medium borders */
					accent: '#007AFF',      /* Blue borders */
				},
				// Coin-specific colors
				coin: {
					gold: '#FFD700',        /* Gold */
					silver: '#C0C0C0',      /* Silver  */
					bronze: '#CD7F32',      /* Bronze */
					platinum: '#E5E4E2',    /* Platinum */
					copper: '#B87333',      /* Copper */
				},
				// Vibrant accent colors for colorful text
				electric: {
					blue: '#007AFF',        /* Blue */
					purple: '#5856D6',      /* Purple */
					pink: '#FF2D92',        /* Pink */
					cyan: '#5AC8FA',        /* Cyan */
					emerald: '#34C759',     /* Green */
					orange: '#FF9500',      /* Orange */
					red: '#FF3B30',         /* Red */
					indigo: '#5856D6',      /* Indigo */
					teal: '#5AC8FA',        /* Teal */
					lime: '#34C759',        /* Lime */
					yellow: '#FFCC00',      /* Yellow */
				},
				// Status colors
				status: {
					online: '#34C759',      /* Green */
					offline: '#8E8E93',     /* Gray */
					away: '#FF9500',        /* Orange */
					busy: '#FF3B30',        /* Red */
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(0, 122, 255, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(0, 122, 255, 0.6)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				serif: ['Playfair Display', 'Georgia', 'serif'],
				mono: ['JetBrains Mono', 'monospace']
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }]
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
