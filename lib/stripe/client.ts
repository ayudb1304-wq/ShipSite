import { loadStripe } from "@stripe/stripe-js"
import { env } from "@/env.mjs"

export const getStripe = () => {
  return loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
}
