# ⚡️ The "GitKit" Stack

Built for developers who want to ship, not configure. This is not just a template; it's an opinionated, production-grade architecture.

### 💰 Multi-Provider Payments (Adapter Pattern)

Switch payment providers by changing **one environment variable**. No code rewrites.

- **Supported Adapters:** Stripe, Lemon Squeezy, Razorpay, Dodo Payments.
- **Unified API:** `createCheckoutSession` and `handleWebhook` work identically across all providers.
- **Source:** [`lib/payments/index.ts`](./lib/payments/index.ts)

### 🚅 High-Performance Data Layer

- **Drizzle ORM:** Zero-dependency, lightweight, and type-safe. No heavy Prisma runtime.
- **Supabase (PostgreSQL):** Includes automatic profile creation triggers.
- **Migrations:** Automated via Drizzle Kit.
- **Source:** [`db/schema.ts`](./db/schema.ts)

### 🔒 Type-Safe Authentication & Logic

- **Server Actions:** Mutations validated with **Zod** directly on the server. No API route bloat.
- **Supabase Auth:** Magic Link & Google OAuth pre-configured.
- **Middleware Protection:** Edge-ready route guarding.
- **Environment Validation:** `env.mjs` ensures your app never crashes due to missing keys.
- **Source:** [`actions/auth.ts`](./actions/auth.ts) & [`env.mjs`](./env.mjs)

### 📧 Transactional Email System

- **Resend Integration:** Pre-built HTML templates for Welcome and Subscription confirmations.
- **React-Email:** Write emails in React, send as HTML.
- **Source:** [`lib/emails/templates.ts`](./lib/emails/templates.ts)

### 🚀 Production Essentials

- **SEO Ready:** Dynamic `sitemap.ts`, `robots.ts`, and OpenGraph generation (`opengraph-image.tsx`).
- **Analytics:** PostHog provider included.
- **Components:** Shadcn/UI + Tailwind CSS for rapid UI development.
- **Billing Portal:** Self-service subscription management included.

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

> **Troubleshooting Installation:**
> If you encounter issues while installing packages, try the following:
> 1. Ensure you are using Node.js version 18 or higher (`node -v`).
> 2. Clear your npm cache: `npm cache clean --force`
> 3. Delete `node_modules` and `package-lock.json` and try again.
> 4. If peer dependency issues persist, try running: `npm install --legacy-peer-deps`

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

#### Step 2: Apply Database Migrations

The initial migration (`0000_initial_schema.sql`) creates all tables including:
- `profiles` table with automatic user profile creation trigger
- `subscriptions` table with multi-provider payment support
- `todos` table for the example feature

**For Fresh Databases (First-Time Setup):**

The `db:push` command will create all tables with the correct schema. Alternatively, you can run the initial migration manually:

1. Go to your Supabase Dashboard → **SQL Editor**
2. Copy and paste the contents of `db/migrations/0000_initial_schema.sql`
3. Click **Run** to execute the SQL

**For Existing Databases (Upgrading):**

If you have an existing database with the old Stripe-only schema, run:

```bash
npm run db:migrate
```

This will apply the refactor migration (`0001_refactor_subscriptions_multi_provider.sql`) which safely migrates your existing data to the new multi-provider schema.

> **⚠️ IMPORTANT:** The initial migration includes a database trigger that automatically creates user profiles when users sign up. Without this trigger, new user registrations will fail!

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
│   ├── payments/          # Multi-provider payment adapters
│   ├── config.ts          # Multi-provider plan configuration
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

The starter kit supports multiple payment providers through a unified adapter pattern:

- **Stripe** (default)
- **Lemon Squeezy**
- **Razorpay**
- **Dodo Payments**

Switch providers by setting `NEXT_PUBLIC_PAYMENT_PROVIDER` in your `.env` file. See [docs/PAYMENTS.md](./docs/PAYMENTS.md) for detailed setup instructions for each provider.

### Setting Up Stripe (Default)

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

## 💳 Multi-Provider Payments

The payment system supports multiple providers (Stripe, Lemon Squeezy, Razorpay, Dodo) through a unified interface. See [docs/PAYMENTS.md](./docs/PAYMENTS.md) for complete setup instructions.

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
4. **Set up Email Templates**: Email templates are included in `lib/emails/` - configure your Resend domain
5. **Configure SEO**: Update metadata in `app/layout.tsx`
6. **Run Database Migrations**: After adding new tables (like the example `todos` table), run `npm run db:push` to sync your schema

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

Built with ❤️ 
