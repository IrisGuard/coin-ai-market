# Coin AI Market

A modern marketplace for coin collectors and dealers.

<!-- Database cleaned - coins removed - ready for real data: 2025-01-22 22:50 -->

## Features

- 🤖 **AI-Powered Coin Analysis** - Upload images for automatic coin identification and valuation
- 🏪 **Marketplace** - Buy and sell coins with auction and fixed-price options
- 👥 **User Authentication** - Secure login with Supabase Auth
- 🛡️ **Admin Panel** - Comprehensive administration tools with error monitoring
- 📊 **Real-time Analytics** - Live error tracking and performance monitoring
- 🔐 **Secure API Management** - Encrypted storage of API keys

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **Backend**: Supabase (Database, Auth, Storage)
- **Deployment**: Vercel
- **Monitoring**: Sentry
- **CI/CD**: GitHub Actions

## Required API Keys

### Production Deployment
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_OPENAI_API_KEY` - OpenAI API key for coin analysis
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key for payments
- `VITE_STRIPE_SECRET_KEY` - Stripe secret key (server-side)
- `VITE_SENTRY_DSN` - Sentry DSN for error monitoring

### Development
- Set up environment variables in `.env.local`
- Configure API keys in the admin panel

## Setup Instructions

### 1. GitHub Setup
1. Connect your Lovable project to GitHub
2. Push your code to the main branch
3. Configure GitHub secrets for deployment

### 2. Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable Sentry integration for error monitoring

### 3. Supabase Configuration
1. Create a new Supabase project
2. Run the SQL migrations from `/sql/supabase-migration.sql`
3. Configure RLS policies and authentication

### 4. Admin Panel Access
- Use `Ctrl + Alt + A` to access the admin panel
- Default admin credentials need to be set up in Supabase

## Deployment Status

### Current Completion: ~70%

#### ✅ Completed
- Core marketplace functionality
- User authentication system
- Admin panel with error monitoring
- API key management
- Real-time error logging
- GitHub/Vercel configuration files

#### 🚧 In Progress
- AI coin analysis integration
- Payment processing with Stripe
- Real-time notifications
- Advanced analytics dashboard

#### ⏳ Pending
- Production Supabase setup
- API key configuration
- Sentry error monitoring setup
- Performance optimization

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Error Monitoring

The platform includes comprehensive error monitoring:

- **Client-side errors** - Automatically captured and logged
- **Console errors** - Intercepted and sent to monitoring
- **Unhandled rejections** - Tracked and reported
- **Admin dashboard** - Real-time error visualization

## Admin Features

Access via `Ctrl + Alt + A`:

- User management
- Coin moderation
- Transaction monitoring
- Error logs and analytics
- API key management
- System configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
