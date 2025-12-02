import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { db } from "@/db";
import { profiles, subscriptions, customers } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for subscription management.
 * 
 * Events handled:
 * - checkout.session.completed: New subscription created
 * - customer.subscription.updated: Subscription updated
 * - customer.subscription.deleted: Subscription cancelled
 * - invoice.payment_succeeded: Payment successful
 * - invoice.payment_failed: Payment failed
 */

// Disable body parsing for webhook signature verification
export const dynamic = "force-dynamic";

async function getUserIdFromCustomerId(customerId: string): Promise<string | null> {
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.stripeCustomerId, customerId))
    .limit(1);

  return customer?.id || null;
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!subscriptionId) {
    console.log("No subscription ID in checkout session (one-time payment)");
    return;
  }

  // Get the subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as {
    id: string;
    status: string;
    items: { data: Array<{ price: { id: string }; quantity?: number }> };
    cancel_at_period_end: boolean;
    billing_cycle_anchor: number;
    start_date: number;
    trial_start?: number | null;
    trial_end?: number | null;
  };
  
  const userId = await getUserIdFromCustomerId(customerId);

  if (!userId) {
    console.error("User not found for customer:", customerId);
    return;
  }

  // Calculate period end based on monthly cycle (30 days from anchor)
  const periodStart = new Date(subscription.billing_cycle_anchor * 1000);
  const periodEnd = new Date(subscription.billing_cycle_anchor * 1000);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  // Upsert subscription
  await db
    .insert(subscriptions)
    .values({
      id: subscription.id,
      userId,
      status: subscription.status as "active" | "trialing" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "unpaid" | "paused",
      priceId: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity || 1,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    })
    .onConflictDoUpdate({
      target: subscriptions.id,
      set: {
        status: subscription.status as "active" | "trialing" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "unpaid" | "paused",
        priceId: subscription.items.data[0].price.id,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        updatedAt: new Date(),
      },
    });

  // Update user profile to Pro
  await db
    .update(profiles)
    .set({
      isPro: true,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));

  console.log(`Subscription ${subscription.id} created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const userId = await getUserIdFromCustomerId(customerId);

  if (!userId) {
    console.error("User not found for customer:", customerId);
    return;
  }

  const isActive = ["active", "trialing"].includes(subscription.status);
  
  // Type assertion for billing properties
  const sub = subscription as unknown as {
    billing_cycle_anchor: number;
    cancel_at?: number | null;
    canceled_at?: number | null;
    ended_at?: number | null;
  };
  
  const periodStart = new Date(sub.billing_cycle_anchor * 1000);
  const periodEnd = new Date(sub.billing_cycle_anchor * 1000);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  // Update subscription
  await db
    .update(subscriptions)
    .set({
      status: subscription.status as "active" | "trialing" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "unpaid" | "paused",
      priceId: subscription.items.data[0].price.id,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAt: sub.cancel_at
        ? new Date(sub.cancel_at * 1000)
        : null,
      canceledAt: sub.canceled_at
        ? new Date(sub.canceled_at * 1000)
        : null,
      endedAt: sub.ended_at
        ? new Date(sub.ended_at * 1000)
        : null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscription.id));

  // Update user Pro status
  await db
    .update(profiles)
    .set({
      isPro: isActive,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));

  console.log(`Subscription ${subscription.id} updated for user ${userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const userId = await getUserIdFromCustomerId(customerId);

  if (!userId) {
    console.error("User not found for customer:", customerId);
    return;
  }

  // Update subscription as ended
  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      endedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscription.id));

  // Remove Pro status
  await db
    .update(profiles)
    .set({
      isPro: false,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));

  console.log(`Subscription ${subscription.id} deleted for user ${userId}`);
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  console.log(`Received webhook: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        console.log("Payment succeeded:", (event.data.object as Stripe.Invoice).id);
        break;

      case "invoice.payment_failed":
        console.log("Payment failed:", (event.data.object as Stripe.Invoice).id);
        // TODO: Send email notification about failed payment
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
