import { NextRequest, NextResponse } from "next/server"
import { getPaymentProvider } from "@/lib/payments"
import { db } from "@/db"
import { subscriptions, profiles } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { getPlanFromVariantId } from "@/lib/config"
import { sendSubscriptionConfirmationEmail } from "@/lib/emails"

/**
 * Dodo Payments Webhook Handler
 * 
 * Processes Dodo Payments webhook events and updates the database using the
 * provider-agnostic schema.
 */
export async function POST(req: NextRequest) {
  try {
    const provider = getPaymentProvider()
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

    if (!userId && webhookData.event.includes("subscription.created")) {
      console.error("No userId in webhook metadata")
      return NextResponse.json({ error: "No userId" }, { status: 400 })
    }

    // Map provider status to our internal status
    const status = provider.mapStatus(webhookData.status)

    // Get plan from plan ID
    const planKey = webhookData.priceId
      ? getPlanFromVariantId(webhookData.priceId, "dodo")
      : null
    const plan = planKey ? planKey.toLowerCase() : "free"

    if (webhookData.event.includes("subscription.created") || webhookData.event.includes("subscription.updated")) {
      if (!userId) {
        return NextResponse.json({ error: "No userId" }, { status: 400 })
      }

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
            provider: "dodo",
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
          provider: "dodo",
          customerId: webhookData.customerId,
          subscriptionId: webhookData.subscriptionId || null,
          priceId: webhookData.priceId,
          currentPeriodEnd: webhookData.currentPeriodEnd,
          status: status,
          plan: plan,
        })
      }

      // Send subscription confirmation email
      if (userProfile?.email && plan !== "free" && webhookData.event.includes("subscription.created")) {
        await sendSubscriptionConfirmationEmail({
          to: userProfile.email,
          name: userProfile.fullName || undefined,
          planName: plan.charAt(0).toUpperCase() + plan.slice(1),
        }).catch((error) => {
          console.error("Failed to send subscription confirmation email:", error)
        })
      }
    } else if (webhookData.event.includes("subscription.cancelled") || webhookData.event.includes("subscription.expired")) {
      if (!webhookData.subscriptionId) {
        return NextResponse.json({ error: "No subscription ID" }, { status: 400 })
      }

      const [existingSubscription] = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.subscriptionId, webhookData.subscriptionId),
            eq(subscriptions.provider, "dodo")
          )
        )
        .limit(1)

      if (existingSubscription) {
        await db
          .update(subscriptions)
          .set({
            status: "canceled",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(subscriptions.subscriptionId, webhookData.subscriptionId),
              eq(subscriptions.provider, "dodo")
            )
          )
      }
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
