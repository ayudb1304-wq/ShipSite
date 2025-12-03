import { NextRequest, NextResponse } from "next/server"
import { getPaymentProvider } from "@/lib/payments"
import { db } from "@/db"
import { subscriptions, profiles } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { getPlanFromVariantId } from "@/lib/config"
import { sendSubscriptionConfirmationEmail } from "@/lib/emails"

/**
 * Stripe Webhook Handler
 * 
 * Processes Stripe webhook events and updates the database using the
 * provider-agnostic schema. Uses the Stripe payment adapter for event processing.
 */
export async function POST(req: NextRequest) {
  try {
    const provider = getPaymentProvider()
    // Clone the request to avoid body consumption issues
    const body = await req.text()
    const headers = new Headers()
    req.headers.forEach((value, key) => {
      headers.set(key, value)
    })
    const request = new Request(req.url, {
      method: req.method,
      headers: headers,
      body: body,
    })
    const webhookData = await provider.handleWebhook(request)

    const userId = webhookData.metadata?.user_id

    if (!userId && webhookData.event === "checkout.session.completed") {
      console.error("No userId in webhook metadata")
      return NextResponse.json({ error: "No userId" }, { status: 400 })
    }

    // Map provider status to our internal status
    const status = provider.mapStatus(webhookData.status)

    // Get plan from variant ID
    const planKey = webhookData.priceId
      ? getPlanFromVariantId(webhookData.priceId, "stripe")
      : null
    const plan = planKey ? planKey.toLowerCase() : "free"

    switch (webhookData.event) {
      case "checkout.session.completed": {
        if (!userId) break

        // Update or create subscription record
        const [existingSubscription] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, userId))
          .limit(1)

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
              provider: "stripe",
              customerId: webhookData.customerId,
              subscriptionId: webhookData.subscriptionId || null,
              priceId: webhookData.priceId,
              currentPeriodEnd: webhookData.currentPeriodEnd,
              status: status,
              plan: plan,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.userId, userId))
        } else {
          await db.insert(subscriptions).values({
            userId: userId,
            provider: "stripe",
            customerId: webhookData.customerId,
            subscriptionId: webhookData.subscriptionId || null,
            priceId: webhookData.priceId,
            currentPeriodEnd: webhookData.currentPeriodEnd,
            status: status,
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
        break
      }

      case "customer.subscription.updated": {
        if (!webhookData.subscriptionId) break

        // Find subscription by subscriptionId and provider
        const [existingSubscription] = await db
          .select()
          .from(subscriptions)
          .where(
            and(
              eq(subscriptions.subscriptionId, webhookData.subscriptionId),
              eq(subscriptions.provider, "stripe")
            )
          )
          .limit(1)

        if (existingSubscription) {
          await db
            .update(subscriptions)
            .set({
              priceId: webhookData.priceId,
              currentPeriodEnd: webhookData.currentPeriodEnd,
              status: status,
              plan: plan,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(subscriptions.subscriptionId, webhookData.subscriptionId),
                eq(subscriptions.provider, "stripe")
              )
            )
        }
        break
      }

      case "customer.subscription.deleted": {
        if (!webhookData.subscriptionId) break

        const [existingSubscription] = await db
          .select()
          .from(subscriptions)
          .where(
            and(
              eq(subscriptions.subscriptionId, webhookData.subscriptionId),
              eq(subscriptions.provider, "stripe")
            )
          )
          .limit(1)

        if (existingSubscription) {
          await db
            .update(subscriptions)
            .set({
              status: "canceled",
              subscriptionId: null,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(subscriptions.subscriptionId, webhookData.subscriptionId),
                eq(subscriptions.provider, "stripe")
              )
            )
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${webhookData.event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook handler failed" },
      { status: 500 }
    )
  }
}
