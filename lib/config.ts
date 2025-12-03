/**
 * Multi-Provider Payment Plans Configuration
 * 
 * This configuration supports multiple payment providers (Stripe, Lemon Squeezy, Razorpay, Dodo).
 * Each plan defines variant IDs for each provider, allowing you to switch providers
 * without changing plan logic.
 * 
 * To configure:
 * 1. Set NEXT_PUBLIC_PAYMENT_PROVIDER in your .env file
 * 2. Add the appropriate variant IDs for your selected provider below
 * 3. Ensure you have the required API keys for your provider in .env
 */

export type PaymentProvider = "stripe" | "lemonsqueezy" | "razorpay" | "dodo"

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    variantIds: {
      stripe: { monthly: null, yearly: null },
      lemonsqueezy: { monthly: null, yearly: null },
      razorpay: { monthly: null, yearly: null },
      dodo: { monthly: null, yearly: null },
    },
    features: [
      "Basic features",
      "Community support",
    ],
  },
  PRO: {
    name: "Pro",
    price: 29,
    variantIds: {
      stripe: {
        monthly: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly",
        yearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY || "price_pro_yearly",
      },
      lemonsqueezy: {
        monthly: process.env.LEMONSQUEEZY_PRO_VARIANT_ID_MONTHLY || "variant_pro_monthly",
        yearly: process.env.LEMONSQUEEZY_PRO_VARIANT_ID_YEARLY || "variant_pro_yearly",
      },
      razorpay: {
        monthly: process.env.RAZORPAY_PRO_PLAN_ID_MONTHLY || "plan_pro_monthly",
        yearly: process.env.RAZORPAY_PRO_PLAN_ID_YEARLY || "plan_pro_yearly",
      },
      dodo: {
        monthly: process.env.DODO_PRO_PLAN_ID_MONTHLY || "plan_pro_monthly",
        yearly: process.env.DODO_PRO_PLAN_ID_YEARLY || "plan_pro_yearly",
      },
    },
    features: [
      "Everything in Free",
      "Advanced features",
      "Priority support",
      "API access",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 99,
    variantIds: {
      stripe: {
        monthly: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_monthly",
        yearly: process.env.STRIPE_ENTERPRISE_PRICE_ID_YEARLY || "price_enterprise_yearly",
      },
      lemonsqueezy: {
        monthly: process.env.LEMONSQUEEZY_ENTERPRISE_VARIANT_ID_MONTHLY || "variant_enterprise_monthly",
        yearly: process.env.LEMONSQUEEZY_ENTERPRISE_VARIANT_ID_YEARLY || "variant_enterprise_yearly",
      },
      razorpay: {
        monthly: process.env.RAZORPAY_ENTERPRISE_PLAN_ID_MONTHLY || "plan_enterprise_monthly",
        yearly: process.env.RAZORPAY_ENTERPRISE_PLAN_ID_YEARLY || "plan_enterprise_yearly",
      },
      dodo: {
        monthly: process.env.DODO_ENTERPRISE_PLAN_ID_MONTHLY || "plan_enterprise_monthly",
        yearly: process.env.DODO_ENTERPRISE_PLAN_ID_YEARLY || "plan_enterprise_yearly",
      },
    },
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
} as const

export type PlanType = keyof typeof PLANS

/**
 * Gets the variant ID for a plan based on the active payment provider
 * @param planKey - The plan key (e.g., "PRO", "ENTERPRISE")
 * @param isYearly - Whether to get the yearly variant
 * @param provider - Optional provider override (defaults to env var)
 * @returns The variant ID or null if not configured
 */
export function getVariantId(
  planKey: PlanType,
  isYearly: boolean,
  provider?: PaymentProvider
): string | null {
  const { getPaymentProviderName } = require("@/lib/payments")
  const activeProvider = provider || getPaymentProviderName()
  const plan = PLANS[planKey]
  const variant = isYearly ? plan.variantIds[activeProvider].yearly : plan.variantIds[activeProvider].monthly
  return variant
}

/**
 * Gets the plan key from a variant ID (reverse lookup)
 * Useful for webhook processing
 * @param variantId - The variant ID from the payment provider
 * @param provider - The payment provider
 * @returns The plan key or null if not found
 */
export function getPlanFromVariantId(
  variantId: string | null | undefined,
  provider: PaymentProvider
): PlanType | null {
  if (!variantId) return null

  for (const [planKey, plan] of Object.entries(PLANS)) {
    const variants = plan.variantIds[provider]
    if (variants.monthly === variantId || variants.yearly === variantId) {
      return planKey as PlanType
    }
  }

  return null
}

// Legacy export for backward compatibility (deprecated)
/** @deprecated Use PLANS instead */
export const STRIPE_PLANS = PLANS
