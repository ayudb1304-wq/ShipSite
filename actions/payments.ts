"use server"

/**
 * Generic Payment Server Actions
 * 
 * Handles payment processing for all supported providers (Stripe, Lemon Squeezy, Razorpay, Dodo).
 * The active provider is determined by NEXT_PUBLIC_PAYMENT_PROVIDER environment variable.
 * 
 * Note: Webhook handling is done in app/api/webhooks/[provider]/route.ts
 */

import { redirect } from "next/navigation"
import { getUser } from "@/actions/auth"
import { getPaymentProvider } from "@/lib/payments"
import { db } from "@/db"
import { subscriptions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { env } from "@/env.mjs"
import { getVariantId } from "@/lib/config"
import { getPaymentProviderName } from "@/lib/payments"
import type { PlanType } from "@/lib/config"

/**
 * Creates a checkout session for a subscription plan
 * @param planKey - The plan key (e.g., "PRO", "ENTERPRISE")
 * @param isYearly - Whether the subscription is yearly or monthly
 */
export async function createCheckoutSession(planKey: PlanType, isYearly: boolean = false) {
  const user = await getUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    const provider = getPaymentProvider()
    const providerName = getPaymentProviderName()

    // Get the variant ID for the selected plan and provider
    const variantId = getVariantId(planKey, isYearly, providerName)

    if (!variantId) {
      return {
        error: `Plan ${planKey} is not configured for ${providerName}`,
      }
    }

    // Get existing customer ID if available
    let customerId: string | null = null

    // Check if user already has a subscription
    const [existingSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1)

    if (existingSubscription?.customerId) {
      customerId = existingSubscription.customerId
    }
    // Customer will be created by the payment provider during checkout if needed

    // Create checkout session
    const result = await provider.createCheckoutSession(
      user.id,
      variantId,
      customerId,
      `${env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      `${env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`
    )

    redirect(result.url)
  } catch (error) {
    console.error("Checkout session error:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    }
  }
}

/**
 * Creates a customer portal session for managing subscriptions
 */
export async function createCustomerPortalSession() {
  const user = await getUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    const provider = getPaymentProvider()

    // Get user's subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1)

    if (!subscription?.customerId) {
      return {
        error: "No subscription found",
      }
    }

    // Create portal session
    const result = await provider.createCustomerPortal(subscription.customerId)

    redirect(result.url)
  } catch (error) {
    console.error("Portal session error:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to create portal session",
    }
  }
}

/**
 * Gets the user's current subscription
 */
export async function getUserSubscription() {
  const user = await getUser()

  if (!user) {
    return null
  }

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1)

  return subscription || null
}
