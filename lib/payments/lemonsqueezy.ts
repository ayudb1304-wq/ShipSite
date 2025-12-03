/**
 * Lemon Squeezy Payment Provider Adapter
 * 
 * Implements the PaymentProvider interface for Lemon Squeezy.
 */

import { env } from "@/env.mjs"
import type {
  PaymentProvider,
  CheckoutSessionResult,
  CustomerPortalResult,
  SubscriptionDetails,
  SubscriptionStatus,
} from "./types"

export class LemonSqueezyProvider implements PaymentProvider {
  private apiKey: string
  private storeId: string
  private baseUrl = "https://api.lemonsqueezy.com/v1"

  constructor() {
    if (!env.LEMONSQUEEZY_API_KEY) {
      throw new Error("Lemon Squeezy API key is not configured")
    }
    if (!env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID) {
      throw new Error("Lemon Squeezy store ID is not configured")
    }
    this.apiKey = env.LEMONSQUEEZY_API_KEY
    this.storeId = env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID
  }

  async createCheckoutSession(
    userId: string,
    variantId: string,
    customerId: string | null,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResult> {
    const response = await fetch(`${this.baseUrl}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            custom_price: null,
            product_options: {
              name: "Subscription",
              description: "Subscription checkout",
            },
            checkout_options: {
              embed: false,
              media: false,
              logo: true,
            },
            checkout_data: {
              email: null,
              name: null,
              custom: {
                user_id: userId,
              },
            },
            preview: false,
            test_mode: process.env.NODE_ENV !== "production",
            expires_at: null,
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: this.storeId,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create checkout session: ${error}`)
    }

    const data = await response.json()
    const checkoutUrl = data.data.attributes.url

    return {
      url: checkoutUrl,
      sessionId: data.data.id,
    }
  }

  async createCustomerPortal(customerId: string): Promise<CustomerPortalResult> {
    // Lemon Squeezy uses customer portal URLs
    // You need to create a customer portal link via their API
    const response = await fetch(`${this.baseUrl}/customers/${customerId}/portal`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/vnd.api+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to create customer portal session")
    }

    const data = await response.json()
    return {
      url: data.data.attributes.url,
    }
  }

  async getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetails> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/vnd.api+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to retrieve subscription details")
    }

    const data = await response.json()
    const subscription = data.data

    return {
      id: subscription.id,
      customerId: subscription.relationships.customer.data.id,
      status: this.mapStatus(subscription.attributes.status),
      plan: this.getPlanFromVariantId(subscription.relationships.variant.data.id),
      priceId: subscription.relationships.variant.data.id,
      currentPeriodEnd: subscription.attributes.renews_at
        ? new Date(subscription.attributes.renews_at)
        : null,
      cancelAtPeriodEnd: subscription.attributes.cancelled,
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
    const signature = request.headers.get("x-signature")

    if (!signature) {
      throw new Error("No signature provided")
    }

    if (!env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      throw new Error("Lemon Squeezy webhook secret is not configured")
    }

    // Verify webhook signature
    const crypto = await import("crypto")
    const hmac = crypto.createHmac("sha256", env.LEMONSQUEEZY_WEBHOOK_SECRET)
    hmac.update(body)
    const calculatedSignature = hmac.digest("hex")

    if (signature !== calculatedSignature) {
      throw new Error("Invalid signature")
    }

    const event = JSON.parse(body)

    switch (event.meta.event_name) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_payment_success":
      case "subscription_payment_failed":
      case "subscription_payment_recovered": {
        const subscription = event.data

        return {
          event: event.meta.event_name,
          subscriptionId: subscription.id,
          customerId: subscription.attributes.customer_id.toString(),
          status: this.mapStatus(subscription.attributes.status),
          plan: this.getPlanFromVariantId(subscription.attributes.variant_id.toString()),
          priceId: subscription.attributes.variant_id.toString(),
          currentPeriodEnd: subscription.attributes.renews_at
            ? new Date(subscription.attributes.renews_at)
            : null,
          cancelAtPeriodEnd: subscription.attributes.cancelled,
          metadata: subscription.attributes.custom || {},
        }
      }

      case "subscription_cancelled": {
        const subscription = event.data

        return {
          event: event.meta.event_name,
          subscriptionId: subscription.id,
          customerId: subscription.attributes.customer_id.toString(),
          status: "canceled",
          plan: this.getPlanFromVariantId(subscription.attributes.variant_id.toString()),
          priceId: subscription.attributes.variant_id.toString(),
          currentPeriodEnd: subscription.attributes.renews_at
            ? new Date(subscription.attributes.renews_at)
            : null,
          cancelAtPeriodEnd: true,
        }
      }

      default:
        throw new Error(`Unhandled event type: ${event.meta.event_name}`)
    }
  }

  mapStatus(providerStatus: string): SubscriptionStatus {
    const statusMap: Record<string, SubscriptionStatus> = {
      active: "active",
      cancelled: "canceled",
      expired: "canceled",
      past_due: "past_due",
      on_trial: "trialing",
      unpaid: "unpaid",
      paused: "paused",
    }

    return statusMap[providerStatus] || "incomplete"
  }

  private getPlanFromVariantId(variantId: string): string {
    // This will be handled by the config system
    return "free"
  }
}
