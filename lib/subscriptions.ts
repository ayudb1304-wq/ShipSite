import { getUserSubscription } from "@/actions/stripe"
import { STRIPE_PLANS } from "@/lib/config"

export async function getUserPlan() {
  const subscription = await getUserSubscription()

  if (!subscription) {
    return {
      plan: "free" as const,
      isPro: false,
      isEnterprise: false,
      status: "active" as const,
    }
  }

  return {
    plan: subscription.plan as "free" | "pro" | "enterprise",
    isPro: subscription.plan === "pro" || subscription.plan === "enterprise",
    isEnterprise: subscription.plan === "enterprise",
    status: subscription.status as
      | "active"
      | "canceled"
      | "past_due"
      | "trialing"
      | "incomplete",
    subscription,
  }
}

export function isSubscriptionActive(status: string): boolean {
  return status === "active" || status === "trialing"
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function getPlanFeatures(plan: "free" | "pro" | "enterprise") {
  return STRIPE_PLANS[plan.toUpperCase() as keyof typeof STRIPE_PLANS].features
}
