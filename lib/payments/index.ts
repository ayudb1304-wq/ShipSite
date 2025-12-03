/**
 * Payment Provider Factory
 * 
 * Returns the appropriate payment provider based on NEXT_PUBLIC_PAYMENT_PROVIDER
 * environment variable. This allows the app to switch providers without code changes.
 */

import { env, type PaymentProvider as PaymentProviderType } from "@/env.mjs"
import { StripeProvider } from "./stripe"
import { LemonSqueezyProvider } from "./lemonsqueezy"
import { RazorpayProvider } from "./razorpay"
import { DodoProvider } from "./dodo"
import type { PaymentProvider } from "./types"

let cachedProvider: PaymentProvider | null = null

/**
 * Gets the active payment provider based on environment configuration
 * @returns The configured payment provider instance
 * @throws Error if the provider is not configured or invalid
 */
export function getPaymentProvider(): PaymentProvider {
  // Return cached provider if available
  if (cachedProvider) {
    return cachedProvider
  }

  const provider = env.NEXT_PUBLIC_PAYMENT_PROVIDER

  switch (provider) {
    case "stripe":
      cachedProvider = new StripeProvider()
      break
    case "lemonsqueezy":
      cachedProvider = new LemonSqueezyProvider()
      break
    case "razorpay":
      cachedProvider = new RazorpayProvider()
      break
    case "dodo":
      cachedProvider = new DodoProvider()
      break
    default:
      throw new Error(
        `Invalid payment provider: ${provider}. Must be one of: stripe, lemonsqueezy, razorpay, dodo`
      )
  }

  return cachedProvider
}

/**
 * Gets the name of the active payment provider
 * @returns The provider name
 */
export function getPaymentProviderName(): PaymentProviderType {
  return env.NEXT_PUBLIC_PAYMENT_PROVIDER
}

/**
 * Resets the cached provider (useful for testing or provider switching)
 */
export function resetPaymentProvider(): void {
  cachedProvider = null
}
