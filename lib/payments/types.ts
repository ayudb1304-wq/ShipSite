/**
 * Payment Provider Adapter Interface
 * 
 * All payment providers must implement this interface to ensure
 * consistent behavior across the application.
 */

export type PaymentProviderName = "stripe" | "lemonsqueezy" | "razorpay" | "dodo"

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete"
  | "unpaid"
  | "paused"

export interface SubscriptionDetails {
  id: string
  customerId: string
  status: SubscriptionStatus
  plan: string
  priceId: string | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
}

export interface CheckoutSessionResult {
  url: string
  sessionId: string
}

export interface CustomerPortalResult {
  url: string
}

/**
 * Payment Provider Adapter Interface
 * 
 * Each payment provider implementation must provide these methods
 * to ensure consistent behavior across the application.
 */
export interface PaymentProvider {
  /**
   * Creates a checkout session for a subscription
   * @param userId - The user ID from the database
   * @param variantId - The provider-specific variant/price ID (e.g., Stripe price_id, Lemon Squeezy variant_id)
   * @param customerId - Optional existing customer ID
   * @param successUrl - URL to redirect to on success
   * @param cancelUrl - URL to redirect to on cancel
   * @returns The checkout session URL and ID
   */
  createCheckoutSession(
    userId: string,
    variantId: string,
    customerId: string | null,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResult>

  /**
   * Creates a customer portal session for managing subscriptions
   * @param customerId - The customer ID from the payment provider
   * @returns The portal session URL
   */
  createCustomerPortal(customerId: string): Promise<CustomerPortalResult>

  /**
   * Retrieves subscription details from the payment provider
   * @param subscriptionId - The subscription ID from the payment provider
   * @returns Subscription details normalized to our internal format
   */
  getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetails>

  /**
   * Handles webhook events from the payment provider
   * @param request - The incoming webhook request
   * @returns The webhook event data for processing
   */
  handleWebhook(request: Request): Promise<{
    event: string
    subscriptionId: string | null
    customerId: string
    status: SubscriptionStatus
    plan: string | null
    priceId: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    metadata?: Record<string, string>
  }>

  /**
   * Maps provider-specific status to our internal status enum
   * @param providerStatus - The status from the payment provider
   * @returns Normalized subscription status
   */
  mapStatus(providerStatus: string): SubscriptionStatus
}
