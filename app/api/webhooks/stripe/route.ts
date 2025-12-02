import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe/server"
import { db } from "@/db"
import { subscriptions, profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { env } from "@/env.mjs"
import Stripe from "stripe"
import { sendSubscriptionConfirmationEmail } from "@/lib/emails"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === "subscription" && session.customer) {
          const customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer.id

          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const userId = session.metadata?.userId

          if (!userId) {
            console.error("No userId in session metadata")
            break
          }

          // Update or create subscription record
          const [existingSubscription] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, userId))
            .limit(1)

          const plan = getPlanFromPriceId(subscription.items.data[0]?.price.id)

          // Get user profile for email
          const [userProfile] = await db
            .select()
            .from(profiles)
            .where(eq(profiles.userId, userId))
            .limit(1)

          if (existingSubscription) {
            await db
              .update(subscriptions)
              .set({
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeCurrentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
                status: subscription.status,
                plan: plan,
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.userId, userId))
          } else {
            await db.insert(subscriptions).values({
              userId: userId,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0]?.price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
              status: subscription.status,
              plan: plan,
            })
          }

          // Send subscription confirmation email
          if (userProfile?.email && plan !== "free") {
            await sendSubscriptionConfirmationEmail({
              to: userProfile.email,
              name: userProfile.fullName || undefined,
              planName: plan.charAt(0).toUpperCase() + plan.slice(1),
            }).catch((error) => {
              // Log but don't fail the webhook if email fails
              console.error("Failed to send subscription confirmation email:", error)
            })
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        // Find subscription by stripeSubscriptionId
        const [existingSubscription] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
          .limit(1)

        if (existingSubscription) {
          const plan = getPlanFromPriceId(subscription.items.data[0]?.price.id)

          await db
            .update(subscriptions)
            .set({
              stripePriceId: subscription.items.data[0]?.price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
              status: subscription.status,
              plan: plan,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        const [existingSubscription] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
          .limit(1)

        if (existingSubscription) {
          await db
            .update(subscriptions)
            .set({
              status: "canceled",
              stripeSubscriptionId: null,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

function getPlanFromPriceId(priceId: string | undefined): string {
  if (!priceId) return "free"

  // Check against configured price IDs
  // Import dynamically to avoid issues
  const STRIPE_PLANS = {
    PRO: {
      priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly",
      priceIdYearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY || "price_pro_yearly",
    },
    ENTERPRISE: {
      priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_monthly",
      priceIdYearly: process.env.STRIPE_ENTERPRISE_PRICE_ID_YEARLY || "price_enterprise_yearly",
    },
  }

  if (
    priceId === STRIPE_PLANS.PRO.priceId ||
    priceId === STRIPE_PLANS.PRO.priceIdYearly
  ) {
    return "pro"
  }

  if (
    priceId === STRIPE_PLANS.ENTERPRISE.priceId ||
    priceId === STRIPE_PLANS.ENTERPRISE.priceIdYearly
  ) {
    return "enterprise"
  }

  return "free"
}
