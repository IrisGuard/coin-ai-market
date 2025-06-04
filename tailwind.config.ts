
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
				// New vibrant color palette
				vibrant: {
					purple: '#8B5CF6',     // Electric purple
					blue: '#3B82F6',       // Bright blue  
					cyan: '#06B6D4',       // Electric cyan
					emerald: '#10B981',    // Vibrant emerald
					orange: '#F59E0B',     // Golden orange
					pink: '#EC4899',       // Hot pink
					red: '#EF4444',        // Vibrant red
					indigo: '#6366F1',     // Deep indigo
					teal: '#14B8A6',       // Ocean teal
					lime: '#84CC16',       // Electric lime
				},
				coin: {
					gold: '#FFD700',       // Pure gold
					silver: '#E5E7EB',     // Silver
					bronze: '#CD7F32',     // Bronze
					copper: '#B87333',     // Copper
					primary: '#8B5CF6',    // Main purple
					secondary: '#06B6D4',  // Cyan accent
					accent: '#F59E0B',     // Orange accent
					success: '#10B981',    // Green success
					warning: '#F59E0B',    // Orange warning
					danger: '#EF4444',     // Red danger
					dark: '#1F2937',       // Dark gray
					light: '#F9FAFB',      // Light gray
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
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'floating': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'50%': { transform: 'translateY(-20px) rotate(5deg)' }
				},
				'coin-flip': {
					'0%, 100%': { transform: 'rotateY(0deg)' },
					'50%': { transform: 'rotateY(180deg)' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
					'50%': { opacity: '0.7', boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' }
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spin-slow': 'spin-slow 10s linear infinite',
				'floating': 'floating 6s ease-in-out infinite',
				'coin-flip': 'coin-flip 8s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'shimmer': 'shimmer 2s infinite'
			},
			backgroundImage: {
				'coin-gradient': 'linear-gradient(135deg, #FFD700 0%, #E5E7EB 50%, #CD7F32 100%)',
				'hero-pattern': 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, rgba(31, 41, 55, 0.05) 100%)',
				'vibrant-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #F59E0B 100%)',
				'purple-cyan': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
				'cyan-emerald': 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)',
				'emerald-orange': 'linear-gradient(135deg, #10B981 0%, #F59E0B 100%)',
				'orange-pink': 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
				'gold-silver': 'linear-gradient(135deg, #FFD700 0%, #E5E7EB 100%)',
				'mesh-gradient': 'radial-gradient(circle at 25% 25%, #8B5CF6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #06B6D4 0%, transparent 50%), radial-gradient(circle at 50% 50%, #F59E0B 0%, transparent 50%)'
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Playfair Display', 'serif'],
				mono: ['JetBrains Mono', 'monospace']
			},
			backdropBlur: {
				xs: '2px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
