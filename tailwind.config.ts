
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
				// Professional Dark Brand Colors
				brand: {
					primary: '#8B5CF6',     // Professional purple
					secondary: '#6366F1',   // Deeper purple
					accent: '#10B981',      // Success green
					success: '#10B981',     // Success green
					warning: '#F59E0B',     // Warning amber
					danger: '#EF4444',      // Error red
					info: '#3B82F6',        // Info blue
					dark: '#0F0F23',        // Darkest background
					light: '#FFFFFF',       // White text
					medium: '#B8BCC8',      // Secondary text
					muted: '#6B7280',       // Muted text
				},
				// Background Colors
				bg: {
					primary: '#0F0F23',     // Darkest background
					secondary: '#1A1B3A',   // Secondary dark
					tertiary: '#252649',    // Card backgrounds
					surface: '#2A2D5A',     // Elevated surfaces
				},
				// Text Colors
				text: {
					primary: '#FFFFFF',     // Primary white text
					secondary: '#B8BCC8',   // Secondary gray text
					muted: '#6B7280',       // Muted text
					accent: '#8B5CF6',      // Accent purple text
				},
				// Border Colors
				'border-custom': {
					primary: '#374151',     // Primary borders
					secondary: '#4B5563',   // Secondary borders
					accent: '#8B5CF6',      // Accent borders
				},
				// Coin-specific colors (updated for dark theme)
				coin: {
					gold: '#FFD700',        // Gold
					silver: '#C0C0C0',      // Silver  
					bronze: '#CD7F32',      // Bronze
					platinum: '#E5E4E2',    // Platinum
					copper: '#B87333',      // Copper
				},
				// Professional electric colors (muted for dark theme)
				electric: {
					blue: '#3B82F6',        // Blue 500
					purple: '#8B5CF6',      // Violet 500
					pink: '#EC4899',        // Pink 500
					cyan: '#06B6D4',        // Cyan 500
					emerald: '#10B981',     // Emerald 500
					orange: '#F97316',      // Orange 500
					red: '#EF4444',         // Red 500
					indigo: '#6366F1',      // Indigo 500
					teal: '#14B8A6',        // Teal 500
					lime: '#84CC16',        // Lime 500
				},
				// Status colors with proper dark theme contrast
				status: {
					online: '#10B981',      // Emerald 500
					offline: '#6B7280',     // Gray 500
					away: '#F59E0B',        // Amber 500
					busy: '#EF4444',        // Red 500
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
					'0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' }
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
