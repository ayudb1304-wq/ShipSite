# Quick Start Guide

Get up and running with the SaaS Starter Kit in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- Accounts for: Supabase, Stripe, Resend
- (Optional) PostHog account

## Step 1: Clone and Install (2 minutes)

```bash
git clone <your-repo-url>
cd saas-starter-kit
npm install
```

## Step 2: Set Up Supabase (3 minutes)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **API**
4. Copy these to `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Settings** → **Database**
6. Copy connection string → `DATABASE_URL`

## Step 3: Set Up Stripe (2 minutes)

1. Create account at [stripe.com](https://stripe.com)
2. Go to **Developers** → **API keys**
3. Copy to `.env.local`:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
4. (For local dev) Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy webhook secret → `STRIPE_WEBHOOK_SECRET`

## Step 4: Set Up Resend (1 minute)

1. Create account at [resend.com](https://resend.com)
2. Create API key
3. Copy to `.env.local`: `RESEND_API_KEY`

## Step 5: Configure Environment (1 minute)

```bash
cp .env.example .env.local
# Fill in all variables from steps above
```

## Step 6: Set Up Database (1 minute)

```bash
# Push schema to database
npm run db:push

# Run trigger migration in Supabase SQL Editor
# Copy contents of db/migrations/0000_create_profiles_trigger.sql
# Paste in Supabase Dashboard → SQL Editor → Run
```

## Step 7: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ You're Done!

You should now be able to:
- ✅ View the landing page
- ✅ Sign up for an account
- ✅ Access the dashboard
- ✅ View pricing page

## Next Steps

1. **Create Stripe Products**: Set up your pricing plans in Stripe Dashboard
2. **Update Price IDs**: Add them to `.env.local` or `lib/config.ts`
3. **Customize Content**: Update landing page, features, FAQ
4. **Configure OAuth**: Set up Google OAuth in Supabase (optional)
5. **Deploy**: Push to Vercel or your preferred platform

## Troubleshooting

If something doesn't work:

1. Check all environment variables are set
2. Verify database connection
3. Check browser console for errors
4. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)
- 💻 [Code Examples](./EXAMPLES.md)
- 🐛 [Troubleshooting](./TROUBLESHOOTING.md)

Happy coding! 🚀
