import { z } from "zod"

// Payment provider type
export type PaymentProvider = "stripe" | "lemonsqueezy" | "razorpay" | "dodo"

const envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Database
  DATABASE_URL: z.string().url(),

  // Payment Provider Selection
  NEXT_PUBLIC_PAYMENT_PROVIDER: z
    .enum(["stripe", "lemonsqueezy", "razorpay", "dodo"])
    .default("stripe"),

  // Stripe (optional - only required if using Stripe)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

  // Lemon Squeezy (optional - only required if using Lemon Squeezy)
  LEMONSQUEEZY_API_KEY: z.string().min(1).optional(),
  LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID: z.string().min(1).optional(),

  // Razorpay (optional - only required if using Razorpay)
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),

  // Dodo Payments (optional - only required if using Dodo)
  DODO_API_KEY: z.string().min(1).optional(),
  DODO_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_DODO_MERCHANT_ID: z.string().min(1).optional(),

  // Resend
  RESEND_API_KEY: z.string().min(1),

  // PostHog (optional)
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
})

export type Env = z.infer<typeof envSchema>

function validatePaymentProvider(env: z.infer<typeof envSchema>): void {
  const provider = env.NEXT_PUBLIC_PAYMENT_PROVIDER

  switch (provider) {
    case "stripe":
      if (!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || !env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
        throw new Error(
          "Stripe is selected as payment provider but required keys are missing: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET"
        )
      }
      break
    case "lemonsqueezy":
      if (!env.LEMONSQUEEZY_API_KEY || !env.LEMONSQUEEZY_WEBHOOK_SECRET || !env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID) {
        throw new Error(
          "Lemon Squeezy is selected as payment provider but required keys are missing: LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_WEBHOOK_SECRET, NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID"
        )
      }
      break
    case "razorpay":
      if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET || !env.RAZORPAY_WEBHOOK_SECRET) {
        throw new Error(
          "Razorpay is selected as payment provider but required keys are missing: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET"
        )
      }
      break
    case "dodo":
      if (!env.DODO_API_KEY || !env.DODO_WEBHOOK_SECRET || !env.NEXT_PUBLIC_DODO_MERCHANT_ID) {
        throw new Error(
          "Dodo Payments is selected as payment provider but required keys are missing: DODO_API_KEY, DODO_WEBHOOK_SECRET, NEXT_PUBLIC_DODO_MERCHANT_ID"
        )
      }
      break
  }
}

function getEnv(): Env {
  const rawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_PAYMENT_PROVIDER: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY,
    LEMONSQUEEZY_WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    DODO_API_KEY: process.env.DODO_API_KEY,
    DODO_WEBHOOK_SECRET: process.env.DODO_WEBHOOK_SECRET,
    NEXT_PUBLIC_DODO_MERCHANT_ID: process.env.NEXT_PUBLIC_DODO_MERCHANT_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  }

  const parsed = envSchema.safeParse(rawEnv)

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors)
    throw new Error("Invalid environment variables")
  }

  // Validate that the selected payment provider has all required keys
  validatePaymentProvider(parsed.data)

  return parsed.data
}

export const env = getEnv()
