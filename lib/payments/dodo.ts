/**
 * Dodo Payments Provider Adapter
 * 
 * Implements the PaymentProvider interface for Dodo Payments.
 * Note: This is a placeholder implementation as Dodo Payments API
 * documentation may vary. Adjust based on actual API specifications.
 */

import { env } from "@/env.mjs"
import type {
  PaymentProvider,
  CheckoutSessionResult,
  CustomerPortalResult,
  SubscriptionDetails,
  SubscriptionStatus,
} from "./types"

export class DodoProvider implements PaymentProvider {
  private apiKey: string
  private merchantId: string
  private baseUrl = process.env.DODO_API_URL || "https://api.dodopayments.com/v1"

  constructor() {
    if (!env.DODO_API_KEY) {
      throw new Error("Dodo Payments API key is not configured")
    }
    if (!env.NEXT_PUBLIC_DODO_MERCHANT_ID) {
      throw new Error("Dodo Payments merchant ID is not configured")
    }
    this.apiKey = env.DODO_API_KEY
    this.merchantId = env.NEXT_PUBLIC_DODO_MERCHANT_ID
  }

  async createCheckoutSession(
    userId: string,
    variantId: string,
    customerId: string | null,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResult> {
    // Dodo Payments API implementation
    // Adjust this based on actual Dodo Payments API documentation
    const response = await fetch(`${this.baseUrl}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "X-Merchant-Id": this.merchantId,
      },
      body: JSON.stringify({
        plan_id: variantId,
        customer_id: customerId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          user_id: userId,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create checkout session: ${error}`)
    }

    const data = await response.json()

    return {
      url: data.checkout_url || data.url,
      sessionId: data.session_id || data.id,
    }
  }

  async createCustomerPortal(customerId: string): Promise<CustomerPortalResult> {
    // Dodo Payments customer portal implementation
    const response = await fetch(`${this.baseUrl}/customers/${customerId}/portal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "X-Merchant-Id": this.merchantId,
      },
      body: JSON.stringify({
        return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create customer portal session")
    }

    const data = await response.json()

    return {
      url: data.portal_url || data.url,
    }
  }

  async getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetails> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "X-Merchant-Id": this.merchantId,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to retrieve subscription details")
    }

    const data = await response.json()

    return {
      id: data.id,
      customerId: data.customer_id || "",
      status: this.mapStatus(data.status),
      plan: this.getPlanFromPlanId(data.plan_id),
      priceId: data.plan_id,
      currentPeriodEnd: data.current_period_end
        ? new Date(data.current_period_end)
        : null,
      cancelAtPeriodEnd: data.cancel_at_period_end || false,
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
    const signature = request.headers.get("x-dodo-signature")

    if (!signature) {
      throw new Error("No signature provided")
    }

    if (!env.DODO_WEBHOOK_SECRET) {
      throw new Error("Dodo Payments webhook secret is not configured")
    }

    // Verify webhook signature
    const crypto = await import("crypto")
    const hmac = crypto.createHmac("sha256", env.DODO_WEBHOOK_SECRET)
    hmac.update(body)
    const calculatedSignature = hmac.digest("hex")

    if (signature !== calculatedSignature) {
      throw new Error("Invalid signature")
    }

    const event = JSON.parse(body)

    switch (event.type) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.renewed": {
        const subscription = event.data

        return {
          event: event.type,
          subscriptionId: subscription.id,
          customerId: subscription.customer_id || "",
          status: this.mapStatus(subscription.status),
          plan: this.getPlanFromPlanId(subscription.plan_id),
          priceId: subscription.plan_id,
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end)
            : null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
          metadata: subscription.metadata || {},
        }
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        const subscription = event.data

        return {
          event: event.type,
          subscriptionId: subscription.id,
          customerId: subscription.customer_id || "",
          status: "canceled",
          plan: this.getPlanFromPlanId(subscription.plan_id),
          priceId: subscription.plan_id,
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end)
            : null,
          cancelAtPeriodEnd: true,
        }
      }

      default:
        throw new Error(`Unhandled event type: ${event.type}`)
    }
  }

  mapStatus(providerStatus: string): SubscriptionStatus {
    const statusMap: Record<string, SubscriptionStatus> = {
      active: "active",
      cancelled: "canceled",
      expired: "canceled",
      past_due: "past_due",
      trialing: "trialing",
      incomplete: "incomplete",
      unpaid: "unpaid",
      paused: "paused",
    }

    return statusMap[providerStatus] || "incomplete"
  }

  private getPlanFromPlanId(planId: string): string {
    // This will be handled by the config system
    return "free"
  }
}
