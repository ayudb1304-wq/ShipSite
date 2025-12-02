/**
 * Stripe Price IDs and Plan Configuration
 * 
 * Replace these with your actual Stripe Price IDs from your Stripe Dashboard
 * https://dashboard.stripe.com/products
 */
export const STRIPE_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Basic features",
      "Community support",
    ],
  },
  PRO: {
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly",
    priceIdYearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY || "price_pro_yearly",
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
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_monthly",
    priceIdYearly: process.env.STRIPE_ENTERPRISE_PRICE_ID_YEARLY || "price_enterprise_yearly",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
} as const

export type PlanType = keyof typeof STRIPE_PLANS
