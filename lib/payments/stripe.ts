/**
 * Stripe Payment Provider Adapter
 * 
 * Implements the PaymentProvider interface for Stripe.
 * Refactored from lib/stripe/server.ts and actions/stripe.ts
 */

import Stripe from "stripe"
import { env } from "@/env.mjs"
import type {
  PaymentProvider,
  CheckoutSessionResult,
  CustomerPortalResult,
  SubscriptionDetails,
  SubscriptionStatus,
} from "./types"

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe

  constructor() {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not configured")
    }
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20.acacia",
      typescript: true,
    })
  }

  async createCheckoutSession(
    userId: string,
    variantId: string,
    customerId: string | null,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResult> {
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId || undefined,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: variantId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
      },
    })

    if (!session.url) {
      throw new Error("Failed to create checkout session")
    }

    return {
      url: session.url,
      sessionId: session.id,
    }
  }

  async createCustomerPortal(customerId: string): Promise<CustomerPortalResult> {
    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    if (!portalSession.url) {
      throw new Error("Failed to create portal session")
    }

    return {
      url: portalSession.url,
    }
  }

  async getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetails> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)

    return {
      id: subscription.id,
      customerId:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id,
      status: this.mapStatus(subscription.status),
      plan: this.getPlanFromPriceId(subscription.items.data[0]?.price.id),
      priceId: subscription.items.data[0]?.price.id || null,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    }
  }

  async handleWebhook(request: Request): Promise<{
    event: string
    subscriptionId: string | null
    customerId: string
    status: SubscriptionStatus
    plan: string | null
    priceId: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    metadata?: Record<string, string>
  }> {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      throw new Error("No signature provided")
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Stripe webhook secret is not configured")
    }

    let event: Stripe.Event

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      throw new Error("Invalid signature")
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === "subscription" && session.customer) {
          const customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer.id

          const subscription = await this.stripe.subscriptions.retrieve(
            session.subscription as string
          )

          return {
            event: event.type,
            subscriptionId: subscription.id,
            customerId,
            status: this.mapStatus(subscription.status),
            plan: this.getPlanFromPriceId(subscription.items.data[0]?.price.id),
            priceId: subscription.items.data[0]?.price.id || null,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            metadata: session.metadata || {},
          }
        }
        throw new Error("Invalid checkout session")
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        return {
          event: event.type,
          subscriptionId: subscription.id,
          customerId:
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id,
          status: this.mapStatus(subscription.status),
          plan: this.getPlanFromPriceId(subscription.items.data[0]?.price.id),
          priceId: subscription.items.data[0]?.price.id || null,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        }
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        return {
          event: event.type,
          subscriptionId: subscription.id,
          customerId:
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id,
          status: "canceled",
          plan: this.getPlanFromPriceId(subscription.items.data[0]?.price.id),
          priceId: subscription.items.data[0]?.price.id || null,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: false,
        }
      }

      default:
        throw new Error(`Unhandled event type: ${event.type}`)
    }
  }

  mapStatus(providerStatus: string): SubscriptionStatus {
    const statusMap: Record<string, SubscriptionStatus> = {
      active: "active",
      canceled: "canceled",
      past_due: "past_due",
      trialing: "trialing",
      incomplete: "incomplete",
      incomplete_expired: "canceled",
      unpaid: "unpaid",
      paused: "paused",
    }

    return statusMap[providerStatus] || "incomplete"
  }

  private getPlanFromPriceId(priceId: string | undefined): string {
    // This will be handled by the config system
    // For now, return a placeholder
    return "free"
  }
}
