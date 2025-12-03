/**
 * Razorpay Payment Provider Adapter
 * 
 * Implements the PaymentProvider interface for Razorpay.
 */

import { env } from "@/env.mjs"
import type {
  PaymentProvider,
  CheckoutSessionResult,
  CustomerPortalResult,
  SubscriptionDetails,
  SubscriptionStatus,
} from "./types"

export class RazorpayProvider implements PaymentProvider {
  private keyId: string
  private keySecret: string
  private baseUrl = "https://api.razorpay.com/v1"

  constructor() {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials are not configured")
    }
    this.keyId = env.RAZORPAY_KEY_ID
    this.keySecret = env.RAZORPAY_KEY_SECRET
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64")
    return `Basic ${credentials}`
  }

  async createCheckoutSession(
    userId: string,
    variantId: string,
    customerId: string | null,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResult> {
    // Razorpay uses plans and subscriptions
    // variantId here is the plan_id
    const response = await fetch(`${this.baseUrl}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: variantId,
        customer_notify: 1,
        quantity: 1,
        total_count: 0, // 0 for infinite
        notes: {
          user_id: userId,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create subscription: ${error}`)
    }

    const data = await response.json()

    // For Razorpay, we need to create a payment link for the subscription
    const paymentLinkResponse = await fetch(`${this.baseUrl}/payment_links`, {
      method: "POST",
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 0, // Amount is handled by the plan
        currency: "INR",
        description: "Subscription",
        customer: {
          notes: {
            user_id: userId,
          },
        },
        notify: {
          sms: false,
          email: false,
        },
        reminder_enable: true,
        callback_url: successUrl,
        callback_method: "get",
      }),
    })

    if (!paymentLinkResponse.ok) {
      // Fallback: return subscription details and let user complete payment
      return {
        url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?subscription_id=${data.id}`,
        sessionId: data.id,
      }
    }

    const paymentLink = await paymentLinkResponse.json()

    return {
      url: paymentLink.short_url || paymentLink.url,
      sessionId: data.id,
    }
  }

  async createCustomerPortal(customerId: string): Promise<CustomerPortalResult> {
    // Razorpay doesn't have a built-in customer portal
    // Redirect to a custom portal page
    return {
      url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?customer_id=${customerId}`,
    }
  }

  async getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetails> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        Authorization: this.getAuthHeader(),
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
      currentPeriodEnd: data.current_end ? new Date(data.current_end * 1000) : null,
      cancelAtPeriodEnd: data.end_at !== null,
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
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      throw new Error("No signature provided")
    }

    if (!env.RAZORPAY_WEBHOOK_SECRET) {
      throw new Error("Razorpay webhook secret is not configured")
    }

    // Verify webhook signature
    const crypto = await import("crypto")
    const hmac = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    hmac.update(body)
    const calculatedSignature = hmac.digest("hex")

    if (signature !== calculatedSignature) {
      throw new Error("Invalid signature")
    }

    const event = JSON.parse(body)

    switch (event.event) {
      case "subscription.activated":
      case "subscription.charged":
      case "subscription.updated": {
        const subscription = event.payload.subscription.entity

        return {
          event: event.event,
          subscriptionId: subscription.id,
          customerId: subscription.customer_id || "",
          status: this.mapStatus(subscription.status),
          plan: this.getPlanFromPlanId(subscription.plan_id),
          priceId: subscription.plan_id,
          currentPeriodEnd: subscription.current_end
            ? new Date(subscription.current_end * 1000)
            : null,
          cancelAtPeriodEnd: subscription.end_at !== null,
          metadata: subscription.notes || {},
        }
      }

      case "subscription.cancelled":
      case "subscription.halted": {
        const subscription = event.payload.subscription.entity

        return {
          event: event.event,
          subscriptionId: subscription.id,
          customerId: subscription.customer_id || "",
          status: "canceled",
          plan: this.getPlanFromPlanId(subscription.plan_id),
          priceId: subscription.plan_id,
          currentPeriodEnd: subscription.current_end
            ? new Date(subscription.current_end * 1000)
            : null,
          cancelAtPeriodEnd: true,
        }
      }

      default:
        throw new Error(`Unhandled event type: ${event.event}`)
    }
  }

  mapStatus(providerStatus: string): SubscriptionStatus {
    const statusMap: Record<string, SubscriptionStatus> = {
      active: "active",
      cancelled: "canceled",
      completed: "canceled",
      expired: "canceled",
      paused: "paused",
      authentication_failed: "past_due",
      pending: "trialing",
    }

    return statusMap[providerStatus] || "incomplete"
  }

  private getPlanFromPlanId(planId: string): string {
    // This will be handled by the config system
    return "free"
  }
}
