"use client";

import { loadStripe, Stripe } from "@stripe/stripe-js";

/**
 * Stripe Client (Browser)
 * 
 * Lazy-loaded Stripe instance for client-side operations.
 */

let stripePromise: Promise<Stripe | null>;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
}
