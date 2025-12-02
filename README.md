# SaaS Starter Kit

A production-ready SaaS boilerplate built with Next.js 14+, Supabase, Stripe, and modern tooling. This starter kit provides everything you need to launch a monetizable SaaS product quickly.

## 🚀 Features

- **Next.js 14+** with App Router and TypeScript (strict mode)
- **Authentication** via Supabase Auth (Google & Magic Link)
- **Payments** with Stripe (Checkout & Customer Portal)
- **Database** using Supabase PostgreSQL with Drizzle ORM
- **Email** via Resend for transactional emails
- **Analytics** with PostHog (optional)
- **UI Components** built with Shadcn/UI and Tailwind CSS
- **SEO Optimized** with metadata, sitemap, and robots.txt
- **Type-Safe** environment variables with Zod validation

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Stripe account
- A Resend account (for emails)
- (Optional) A PostHog account for analytics

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd saas-starter-kit

# Install dependencies
npm install
```

### 2. Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all the required environment variables:

#### Supabase Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or use an existing one
3. Go to **Settings** → **API**
4. Copy the following:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

5. Go to **Settings** → **Database**
6. Copy the connection string → `DATABASE_URL`
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

7. **Configure Google OAuth** (Optional but recommended):
   - Go to **Authentication** → **Providers** → **Google**
   - Enable Google provider
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Add authorized redirect URL: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - For local development, also add: `http://localhost:3000/auth/callback`

#### Stripe Setup

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

4. Create products and prices in Stripe Dashboard
5. Update `lib/config.ts` with your Price IDs, or set them in `.env.local`:
   ```
   STRIPE_PRO_PRICE_ID=price_...
   STRIPE_PRO_PRICE_ID_YEARLY=price_...
   ```

6. For webhooks (local development):
   - Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
   - Login: `stripe login`
   - Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

#### Resend Setup

1. Go to [Resend](https://resend.com) and create an account
2. Navigate to **API Keys**
3. Create a new API key → `RESEND_API_KEY`

#### PostHog Setup (Optional)

1. Go to [PostHog](https://posthog.com) and create an account
2. Get your Project API Key → `NEXT_PUBLIC_POSTHOG_KEY`
3. Set your host → `NEXT_PUBLIC_POSTHOG_HOST` (default: `https://us.i.posthog.com`)

### 3. Database Setup

#### Step 1: Run Drizzle Migrations

```bash
# Generate migration files from schema
npm run db:generate

# Push schema to database (recommended for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

#### Step 2: Set Up Database Trigger (Important!)

To automatically create user profiles when users sign up, you need to run the trigger migration in your Supabase SQL Editor:

1. Go to your Supabase Dashboard → **SQL Editor**
2. Copy and paste the contents of `db/migrations/0000_create_profiles_trigger.sql`
3. Click **Run** to execute the SQL

This creates a database trigger that automatically creates a profile entry in the `profiles` table whenever a new user signs up via Supabase Auth.

Alternatively, you can run it via the Supabase CLI:
```bash
supabase db push
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes (webhooks only)
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # Shadcn/UI components
│   └── features/          # Feature-specific components
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── stripe/            # Stripe clients
│   ├── config.ts          # Stripe plan configuration
│   └── utils.ts           # Utility functions
├── db/
│   ├── schema.ts          # Drizzle schema definitions
│   └── index.ts           # Database connection
├── actions/               # Server Actions
└── env.mjs                # Type-safe env validation
```

## 🔐 Authentication

The starter kit uses Supabase Auth with:

- Email/Password (Magic Link)
- Google OAuth
- Protected routes via middleware

See `app/sign-in/` and `app/sign-up/` for authentication pages and `middleware.ts` for route protection.

## 💳 Payments

Stripe integration includes:

- **Checkout Sessions**: One-time and subscription payments
- **Customer Portal**: Self-service subscription management
- **Webhook Handler**: Automatic subscription status updates
- **Plan Management**: Free, Pro, and Enterprise tiers

### Setting Up Stripe

1. **Create Products & Prices** in Stripe Dashboard:
   - Go to [Stripe Products](https://dashboard.stripe.com/products)
   - Create products for Pro and Enterprise plans
   - Create monthly and yearly prices for each
   - Copy the Price IDs

2. **Update Price IDs**:
   - Option 1: Set environment variables in `.env.local`:
     ```
     STRIPE_PRO_PRICE_ID=price_...
     STRIPE_PRO_PRICE_ID_YEARLY=price_...
     STRIPE_ENTERPRISE_PRICE_ID=price_...
     STRIPE_ENTERPRISE_PRICE_ID_YEARLY=price_...
     ```
   - Option 2: Update `lib/config.ts` directly

3. **Configure Webhooks**:
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

4. **Local Development**:
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # Login
   stripe login
   
   # Forward webhooks to local server
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   
   # Copy the webhook secret from the output
   ```

5. **Customer Portal** (Optional):
   - Go to [Stripe Settings](https://dashboard.stripe.com/settings/billing/portal)
   - Configure the customer portal settings
   - Enable features you want customers to access

## 💳 Payments

Stripe integration includes:

- Checkout Sessions (one-time and subscriptions)
- Customer Portal for subscription management
- Webhook handler for subscription events
- Plan configuration in `lib/config.ts`

## 📧 Email

Resend is configured for transactional emails. See `actions/` for email actions.

## 🎨 UI Components

Built with Shadcn/UI and Tailwind CSS. All components are in `components/ui/`.

To add more Shadcn components:

```bash
npx shadcn-ui@latest add [component-name]
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS
- DigitalOcean

Make sure to set all environment variables in your hosting platform.

## 📝 Next Steps

1. **Customize the Landing Page**: Update `app/page.tsx` with your content
2. **Configure Plans**: Update `lib/config.ts` with your pricing
3. **Add Features**: Build out your SaaS features in `app/dashboard/`
4. **Set up Email Templates**: Create email templates in Resend
5. **Configure SEO**: Update metadata in `app/layout.tsx`

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[API Documentation](./docs/API.md)**: Server actions, utilities, and API reference
- **[Architecture Guide](./docs/ARCHITECTURE.md)**: System design and architecture decisions
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)**: Common issues and solutions
- **[Code Examples](./docs/EXAMPLES.md)**: Practical code examples
- **[Contributing Guide](./CONTRIBUTING.md)**: Development guidelines

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Database
npm run db:generate      # Generate migration files
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio

# Utilities
npm run clean            # Clear Next.js cache
```

## 🤝 Contributing

This is a starter kit template. Feel free to fork and customize for your needs!

If you're contributing improvements, see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - feel free to use this for your projects.

## 🆘 Support

For issues and questions:

1. **Check Documentation**: Review the [docs](./docs/) directory
2. **Troubleshooting**: See [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
3. **Examples**: Check [EXAMPLES.md](./docs/EXAMPLES.md) for code samples
4. **GitHub Issues**: Open an issue for bugs or feature requests

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Shadcn/UI Documentation](https://ui.shadcn.com/)

---

Built with ❤️ using Next.js, Supabase, and Stripe
