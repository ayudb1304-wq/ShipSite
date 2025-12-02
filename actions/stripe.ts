"use server"

/**
 * Stripe Payment Server Actions
 * 
 * Handles payment processing including:
 * - Creating checkout sessions
 * - Managing customer portal access
 * - Retrieving subscription information
 * 
 * Note: Webhook handling is done in app/api/webhooks/stripe/route.ts
 */

import { redirect } from "next/navigation"
import { getUser } from "@/actions/auth"
import { stripe } from "@/lib/stripe/server"
import { db } from "@/db"
import { subscriptions, profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { env } from "@/env.mjs"
import { STRIPE_PLANS } from "@/lib/config"

export async function createCheckoutSession(priceId: string, isYearly: boolean = false) {
  const user = await getUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Get or create Stripe customer
    let customerId: string

    // Check if user already has a subscription
    const [existingSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1)

    if (existingSubscription?.stripeCustomerId) {
      customerId = existingSubscription.stripeCustomerId
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Create subscription record with free plan
      await db.insert(subscriptions).values({
        userId: user.id,
        stripeCustomerId: customerId,
        status: "active",
        plan: "free",
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    })

    if (!session.url) {
      return {
        error: "Failed to create checkout session",
      }
    }

    redirect(session.url)
  } catch (error) {
    console.error("Checkout session error:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    }
  }
}

export async function createCustomerPortalSession() {
  const user = await getUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Get user's subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1)

    if (!subscription?.stripeCustomerId) {
      return {
        error: "No subscription found",
      }
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    if (!portalSession.url) {
      return {
        error: "Failed to create portal session",
      }
    }

    redirect(portalSession.url)
  } catch (error) {
    console.error("Portal session error:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to create portal session",
    }
  }
}

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
