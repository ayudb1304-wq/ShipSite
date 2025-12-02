# API Documentation

This document describes the server actions, utilities, and API routes available in the SaaS Starter Kit.

## Server Actions

### Authentication Actions (`actions/auth.ts`)

#### `signInWithEmail(formData: FormData)`

Signs in a user with email magic link.

**Parameters:**
- `formData`: FormData containing `email` field

**Returns:**
```typescript
{ error?: string } | { success: true; message: string }
```

**Example:**
```tsx
<form action={signInWithEmail}>
  <input name="email" type="email" required />
  <button type="submit">Send Magic Link</button>
</form>
```

#### `signUpWithEmail(formData: FormData)`

Creates a new user account.

**Parameters:**
- `formData`: FormData containing `email`, `password`, and optional `fullName`

**Returns:**
```typescript
{ error?: string } | { success: true; message: string }
```

#### `signInWithGoogle()`

Initiates Google OAuth sign-in flow.

**Returns:**
- Redirects to Google OAuth or returns error

#### `signOut()`

Signs out the current user.

**Returns:**
- Redirects to `/sign-in`

#### `getUser()`

Gets the current authenticated user with profile data.

**Returns:**
```typescript
{
  id: string
  email: string
  profile: {
    id: string
    userId: string
    email: string
    fullName: string | null
    avatarUrl: string | null
  } | null
} | null
```

### Profile Actions (`actions/profile.ts`)

#### `updateProfile(formData: FormData)`

Updates user profile information.

**Parameters:**
- `formData`: FormData containing `fullName` (optional)

**Returns:**
```typescript
{ error?: string } | { success: true; message: string }
```

### Stripe Actions (`actions/stripe.ts`)

#### `createCheckoutSession(priceId: string, isYearly?: boolean)`

Creates a Stripe Checkout session for subscription.

**Parameters:**
- `priceId`: Stripe Price ID
- `isYearly`: Whether this is a yearly subscription (default: false)

**Returns:**
- Redirects to Stripe Checkout or returns error

#### `createCustomerPortalSession()`

Creates a Stripe Customer Portal session.

**Returns:**
- Redirects to Stripe Customer Portal or returns error

#### `getUserSubscription()`

Gets the current user's subscription.

**Returns:**
```typescript
{
  id: string
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  stripeCurrentPeriodEnd: Date | null
  status: string
  plan: string
} | null
```

## Utilities

### Subscription Utilities (`lib/subscriptions.ts`)

#### `getUserPlan()`

Gets the current user's plan with status.

**Returns:**
```typescript
{
  plan: "free" | "pro" | "enterprise"
  isPro: boolean
  isEnterprise: boolean
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete"
  subscription?: Subscription
}
```

#### `isSubscriptionActive(status: string): boolean`

Checks if a subscription status is active.

#### `formatPrice(price: number): string`

Formats a price as currency (USD).

#### `getPlanFeatures(plan: string): string[]`

Gets the features for a given plan.

### Supabase Clients

#### `createClient()` (Browser)

Creates a Supabase client for browser usage.

**Location:** `lib/supabase/client.ts`

#### `createClient()` (Server)

Creates a Supabase client for server usage.

**Location:** `lib/supabase/server.ts`

#### `supabaseAdmin`

Admin Supabase client with service role key.

**Location:** `lib/supabase/admin.ts`

### Stripe Clients

#### `getStripe()`

Gets Stripe.js instance for browser.

**Location:** `lib/stripe/client.ts`

#### `stripe`

Stripe server-side client.

**Location:** `lib/stripe/server.ts`

## API Routes

### Webhooks

#### `POST /api/webhooks/stripe`

Handles Stripe webhook events.

**Events Handled:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Headers Required:**
- `stripe-signature`: Stripe webhook signature

**Returns:**
```json
{ "received": true }
```

### Auth Callback

#### `GET /auth/callback`

Handles OAuth and magic link callbacks.

**Query Parameters:**
- `code`: Authorization code
- `next`: Redirect path (default: `/dashboard`)

**Returns:**
- Redirects to specified path

## Database Schema

### Profiles Table

```typescript
{
  id: string
  userId: string (unique)
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}
```

### Subscriptions Table

```typescript
{
  id: string
  userId: string
  stripeCustomerId: string (unique)
  stripeSubscriptionId: string | null (unique)
  stripePriceId: string | null
  stripeCurrentPeriodEnd: Date | null
  status: string
  plan: string
  createdAt: Date
  updatedAt: Date
}
```

## Type Definitions

### Environment Variables

See `env.mjs` for all environment variable types and validation.

### Plan Configuration

```typescript
type PlanType = "FREE" | "PRO" | "ENTERPRISE"

interface Plan {
  name: string
  price: number
  priceId: string | null
  priceIdYearly?: string
  features: string[]
}
```

## Error Handling

All server actions return errors in a consistent format:

```typescript
{ error: string }
```

Client-side, check for errors:

```tsx
const result = await action(formData)
if (result.error) {
  // Handle error
  console.error(result.error)
}
```

## Best Practices

1. **Always validate inputs** with Zod before processing
2. **Handle errors gracefully** and return user-friendly messages
3. **Use server actions** for mutations instead of API routes
4. **Type everything** - no `any` types
5. **Revalidate paths** after mutations using `revalidatePath()`
