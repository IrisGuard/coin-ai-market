
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
				// Modern vibrant color palette
				electric: {
					blue: '#0EA5E9',      // Sky blue
					purple: '#8B5CF6',    // Violet
					pink: '#EC4899',      // Hot pink
					cyan: '#06B6D4',      // Cyan
					emerald: '#10B981',   // Emerald
					orange: '#F59E0B',    // Amber
					red: '#EF4444',       // Red
					indigo: '#6366F1',    // Indigo
					teal: '#14B8A6',      // Teal
					lime: '#84CC16',      // Lime
				},
				brand: {
					primary: '#8B5CF6',   // Electric purple
					secondary: '#0EA5E9', // Electric blue
					accent: '#EC4899',    // Electric pink
					success: '#10B981',   // Emerald
					warning: '#F59E0B',   // Amber
					danger: '#EF4444',    // Red
					dark: '#1E293B',      // Slate 800
					light: '#F8FAFC',     // Slate 50
				},
				coin: {
					gold: '#FFD700',      // Pure gold
					silver: '#C0C0C0',    // Silver
					bronze: '#CD7F32',    // Bronze
					platinum: '#E5E4E2',  // Platinum
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'50%': { transform: 'translateY(-20px) rotate(3deg)' }
				},
				'glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)' 
					},
					'50%': { 
						boxShadow: '0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.2)' 
					}
				},
				'gradient-x': {
					'0%, 100%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'bounce-slow': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'gradient-x': 'gradient-x 15s ease infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'bounce-slow': 'bounce-slow 3s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'brand-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #0EA5E9 50%, #EC4899 100%)',
				'hero-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 25%, #0EA5E9 50%, #06B6D4 75%, #10B981 100%)',
				'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
				'mesh-gradient': 'radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(14, 165, 233, 0.2) 0%, transparent 50%)'
			},
			backdropBlur: {
				xs: '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
