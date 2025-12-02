/**
 * Stripe Configuration
 * 
 * Define your pricing plans and Stripe Price IDs here.
 * Update the Price IDs with your actual Stripe dashboard values.
 */

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  popular?: boolean;
  prices: {
    monthly: {
      amount: number;
      priceId: string;
    };
    yearly: {
      amount: number;
      priceId: string;
    };
  };
}

/**
 * Pricing Plans Configuration
 * 
 * IMPORTANT: Replace the priceId values with your actual Stripe Price IDs
 * from your Stripe Dashboard > Products > Pricing
 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for side projects and small apps.",
    features: [
      "Up to 1,000 API calls/month",
      "Basic analytics",
      "Email support",
      "1 team member",
    ],
    prices: {
      monthly: {
        amount: 0,
        priceId: "", // Free tier, no price ID
      },
      yearly: {
        amount: 0,
        priceId: "", // Free tier, no price ID
      },
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses and teams.",
    popular: true,
    features: [
      "Unlimited API calls",
      "Advanced analytics",
      "Priority email support",
      "Up to 5 team members",
      "Custom integrations",
      "API access",
    ],
    prices: {
      monthly: {
        amount: 2900, // $29.00
        priceId: "price_pro_monthly", // Replace with actual Stripe Price ID
      },
      yearly: {
        amount: 29000, // $290.00 (2 months free)
        priceId: "price_pro_yearly", // Replace with actual Stripe Price ID
      },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large-scale applications and organizations.",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "24/7 phone support",
      "Custom SLA",
      "Dedicated account manager",
      "On-premise deployment",
      "SSO/SAML",
    ],
    prices: {
      monthly: {
        amount: 9900, // $99.00
        priceId: "price_enterprise_monthly", // Replace with actual Stripe Price ID
      },
      yearly: {
        amount: 99000, // $990.00 (2 months free)
        priceId: "price_enterprise_yearly", // Replace with actual Stripe Price ID
      },
    },
  },
];

/**
 * Get a plan by its ID
 */
export function getPlanById(planId: string): PricingPlan | undefined {
  return PRICING_PLANS.find((plan) => plan.id === planId);
}

/**
 * Get a plan by its Stripe Price ID
 */
export function getPlanByPriceId(priceId: string): PricingPlan | undefined {
  return PRICING_PLANS.find(
    (plan) =>
      plan.prices.monthly.priceId === priceId ||
      plan.prices.yearly.priceId === priceId
  );
}

/**
 * Check if a price ID belongs to a paid plan
 */
export function isPaidPlan(priceId: string): boolean {
  const plan = getPlanByPriceId(priceId);
  return plan ? plan.id !== "starter" : false;
}
