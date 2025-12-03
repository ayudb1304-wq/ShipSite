# Multi-Provider Payment Architecture

This document explains how to configure and use the multi-provider payment system in ShipSite. The architecture supports Stripe, Lemon Squeezy, Razorpay, and Dodo Payments through a unified adapter pattern.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Switching Payment Providers](#switching-payment-providers)
- [Provider Setup Guides](#provider-setup-guides)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Webhook Setup](#webhook-setup)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

The payment system uses an **Adapter Pattern** to abstract payment provider differences. All providers implement the same `PaymentProvider` interface, ensuring consistent behavior across the application.

### Key Components

1. **Payment Adapters** (`lib/payments/`)
   - `types.ts` - Interface definition
   - `stripe.ts` - Stripe implementation
   - `lemonsqueezy.ts` - Lemon Squeezy implementation
   - `razorpay.ts` - Razorpay implementation
   - `dodo.ts` - Dodo Payments implementation
   - `index.ts` - Factory function

2. **Server Actions** (`actions/payments.ts`)
   - Generic payment actions that work with any provider

3. **Webhook Routes** (`app/api/webhooks/[provider]/route.ts`)
   - Provider-specific webhook handlers

4. **Configuration** (`lib/config.ts`)
   - Multi-provider plan configuration

## Switching Payment Providers

To switch payment providers, you only need to:

1. **Set the environment variable:**
   ```bash
   NEXT_PUBLIC_PAYMENT_PROVIDER=stripe  # or lemonsqueezy, razorpay, dodo
   ```

2. **Update plan configuration in `lib/config.ts`:**
   ```typescript
   export const PLANS = {
     PRO: {
       name: "Pro",
       price: 29,
       variantIds: {
         stripe: {
           monthly: "price_...",
           yearly: "price_...",
         },
         lemonsqueezy: {
           monthly: "variant_...",
           yearly: "variant_...",
         },
         // ... other providers
       },
     },
   }
   ```

3. **Ensure required API keys are set in `.env`** (see provider setup guides below)

That's it! The entire application will automatically use the selected provider.

## Provider Setup Guides

### Stripe

1. **Get API Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy your Publishable Key and Secret Key

2. **Create Products & Prices:**
   - Create products in Stripe Dashboard
   - Note the Price IDs (e.g., `price_1234567890`)

3. **Set Environment Variables:**
   ```bash
   NEXT_PUBLIC_PAYMENT_PROVIDER=stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Configure Plans:**
   ```typescript
   // lib/config.ts
   PRO: {
     variantIds: {
       stripe: {
         monthly: process.env.STRIPE_PRO_PRICE_ID || "price_...",
         yearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY || "price_...",
       },
     },
   }
   ```

5. **Webhook Setup:**
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Lemon Squeezy

1. **Get API Key:**
   - Go to [Lemon Squeezy Settings](https://app.lemonsqueezy.com/settings/api)
   - Create an API key

2. **Get Store ID:**
   - Go to your store settings
   - Note the Store ID

3. **Create Products & Variants:**
   - Create products in Lemon Squeezy
   - Note the Variant IDs (e.g., `12345`)

4. **Set Environment Variables:**
   ```bash
   NEXT_PUBLIC_PAYMENT_PROVIDER=lemonsqueezy
   LEMONSQUEEZY_API_KEY=...
   LEMONSQUEEZY_WEBHOOK_SECRET=...
   NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=...
   ```

5. **Configure Plans:**
   ```typescript
   PRO: {
     variantIds: {
       lemonsqueezy: {
         monthly: process.env.LEMONSQUEEZY_PRO_VARIANT_ID_MONTHLY || "variant_...",
         yearly: process.env.LEMONSQUEEZY_PRO_VARIANT_ID_YEARLY || "variant_...",
       },
     },
   }
   ```

6. **Webhook Setup:**
   - Go to [Lemon Squeezy Webhooks](https://app.lemonsqueezy.com/settings/webhooks)
   - Add endpoint: `https://yourdomain.com/api/webhooks/lemonsqueezy`
   - Select events: `subscription_created`, `subscription_updated`, `subscription_cancelled`
   - Copy the webhook secret to `LEMONSQUEEZY_WEBHOOK_SECRET`

### Razorpay

1. **Get API Keys:**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
   - Copy your Key ID and Key Secret

2. **Create Plans:**
   - Go to [Razorpay Plans](https://dashboard.razorpay.com/app/plans)
   - Create subscription plans
   - Note the Plan IDs (e.g., `plan_1234567890`)

3. **Set Environment Variables:**
   ```bash
   NEXT_PUBLIC_PAYMENT_PROVIDER=razorpay
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   RAZORPAY_WEBHOOK_SECRET=...
   ```

4. **Configure Plans:**
   ```typescript
   PRO: {
     variantIds: {
       razorpay: {
         monthly: process.env.RAZORPAY_PRO_PLAN_ID_MONTHLY || "plan_...",
         yearly: process.env.RAZORPAY_PRO_PLAN_ID_YEARLY || "plan_...",
       },
     },
   }
   ```

5. **Webhook Setup:**
   - Go to [Razorpay Webhooks](https://dashboard.razorpay.com/app/webhooks)
   - Add endpoint: `https://yourdomain.com/api/webhooks/razorpay`
   - Select events: `subscription.activated`, `subscription.updated`, `subscription.cancelled`
   - Copy the webhook secret to `RAZORPAY_WEBHOOK_SECRET`

### Dodo Payments

1. **Get API Key:**
   - Go to your Dodo Payments dashboard
   - Create an API key

2. **Get Merchant ID:**
   - Note your Merchant ID from the dashboard

3. **Create Plans:**
   - Create subscription plans in Dodo Payments
   - Note the Plan IDs

4. **Set Environment Variables:**
   ```bash
   NEXT_PUBLIC_PAYMENT_PROVIDER=dodo
   DODO_API_KEY=...
   DODO_WEBHOOK_SECRET=...
   NEXT_PUBLIC_DODO_MERCHANT_ID=...
   ```

5. **Configure Plans:**
   ```typescript
   PRO: {
     variantIds: {
       dodo: {
         monthly: process.env.DODO_PRO_PLAN_ID_MONTHLY || "plan_...",
         yearly: process.env.DODO_PRO_PLAN_ID_YEARLY || "plan_...",
       },
     },
   }
   ```

6. **Webhook Setup:**
   - Configure webhook endpoint: `https://yourdomain.com/api/webhooks/dodo`
   - Select events: `subscription.created`, `subscription.updated`, `subscription.cancelled`
   - Copy the webhook secret to `DODO_WEBHOOK_SECRET`

## Database Schema

The subscriptions table is provider-agnostic:

```sql
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'stripe', 'lemonsqueezy', 'razorpay', 'dodo'
  customer_id TEXT NOT NULL UNIQUE,
  subscription_id TEXT UNIQUE,
  price_id TEXT,
  current_period_end TIMESTAMP,
  status TEXT NOT NULL,
  plan TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Migration

Run the migration to update your database:

```bash
npm run db:migrate
```

Or apply manually:

```bash
psql $DATABASE_URL < db/migrations/0001_refactor_subscriptions_multi_provider.sql
```

## Configuration

### Plan Configuration

Plans are defined in `lib/config.ts` with variant IDs for each provider:

```typescript
export const PLANS = {
  PRO: {
    name: "Pro",
    price: 29,
    variantIds: {
      stripe: {
        monthly: "price_...",
        yearly: "price_...",
      },
      lemonsqueezy: {
        monthly: "variant_...",
        yearly: "variant_...",
      },
      razorpay: {
        monthly: "plan_...",
        yearly: "plan_...",
      },
      dodo: {
        monthly: "plan_...",
        yearly: "plan_...",
      },
    },
    features: [...],
  },
}
```

### Environment Variables

The system validates that at least one provider is fully configured. See `env.mjs` for the complete schema.

**Required for all providers:**
- `NEXT_PUBLIC_PAYMENT_PROVIDER` - The active provider

**Stripe:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Lemon Squeezy:**
- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID`

**Razorpay:**
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

**Dodo Payments:**
- `DODO_API_KEY`
- `DODO_WEBHOOK_SECRET`
- `NEXT_PUBLIC_DODO_MERCHANT_ID`

## Webhook Setup

Each provider has its own webhook route:

- Stripe: `/api/webhooks/stripe`
- Lemon Squeezy: `/api/webhooks/lemonsqueezy`
- Razorpay: `/api/webhooks/razorpay`
- Dodo: `/api/webhooks/dodo`

All webhooks:
1. Verify the signature
2. Process the event
3. Update the database using the provider-agnostic schema
4. Send confirmation emails (for subscription creation)

## Troubleshooting

### "Payment provider is not configured"

**Solution:** Ensure `NEXT_PUBLIC_PAYMENT_PROVIDER` is set and all required keys for that provider are present in `.env`.

### "Invalid signature" errors

**Solution:** 
- Verify the webhook secret matches your provider dashboard
- Ensure the webhook URL is correct
- Check that the request body isn't being modified (e.g., by middleware)

### Plan not found errors

**Solution:**
- Verify variant IDs in `lib/config.ts` match your provider dashboard
- Check that the plan exists in your provider account
- Ensure environment variables for plan IDs are set correctly

### Database migration errors

**Solution:**
- Backup your database before running migrations
- Check for existing subscriptions with the old schema
- The migration sets `provider = 'stripe'` for existing records

### Type errors

**Solution:**
- Run `npm run type-check` to identify issues
- Ensure all imports use the new paths (`actions/payments` instead of `actions/stripe`)
- Update any custom code that references old schema columns

## Code Examples

### Creating a Checkout Session

```typescript
import { createCheckoutSession } from "@/actions/payments"

// In a server action or form action
await createCheckoutSession("PRO", true) // Pro plan, yearly
```

### Getting User Subscription

```typescript
import { getUserSubscription } from "@/actions/payments"

const subscription = await getUserSubscription()
console.log(subscription?.plan) // "pro", "enterprise", or "free"
console.log(subscription?.provider) // "stripe", "lemonsqueezy", etc.
```

### Accessing Payment Provider Directly

```typescript
import { getPaymentProvider } from "@/lib/payments"

const provider = getPaymentProvider()
const details = await provider.getSubscriptionDetails(subscriptionId)
```

## Best Practices

1. **Always use the generic actions** (`actions/payments.ts`) instead of provider-specific code
2. **Test webhooks locally** using tools like ngrok or Stripe CLI
3. **Keep variant IDs in environment variables** for easier management
4. **Monitor webhook logs** for failed events
5. **Use the same provider in development and production** to avoid confusion

## Migration from Stripe-Only

If you're migrating from the old Stripe-only architecture:

1. Run the database migration
2. Update imports from `actions/stripe` to `actions/payments`
3. Update `STRIPE_PLANS` references to `PLANS`
4. Update schema column references:
   - `stripeCustomerId` → `customerId`
   - `stripeSubscriptionId` → `subscriptionId`
   - `stripePriceId` → `priceId`
   - `stripeCurrentPeriodEnd` → `currentPeriodEnd`
5. Test thoroughly before deploying

## Support

For provider-specific issues, consult:
- [Stripe Documentation](https://stripe.com/docs)
- [Lemon Squeezy Documentation](https://docs.lemonsqueezy.com)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Dodo Payments Documentation](https://dodopayments.com/docs)
