"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { customers, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { 
  createCheckoutSession, 
  createCustomerPortalSession, 
  getOrCreateCustomer 
} from "@/lib/stripe/server";
import { absoluteUrl } from "@/lib/utils";

/**
 * Billing Server Actions
 */

/**
 * Create a checkout session and redirect to Stripe
 */
export async function createCheckout(priceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get or create Stripe customer
  const stripeCustomerId = await getOrCreateCustomer(user.id, user.email!);

  // Store customer in database
  await db
    .insert(customers)
    .values({
      id: user.id,
      stripeCustomerId,
    })
    .onConflictDoNothing();

  // Create checkout session
  const checkoutUrl = await createCheckoutSession({
    customerId: stripeCustomerId,
    priceId,
    successUrl: absoluteUrl("/dashboard?checkout=success"),
    cancelUrl: absoluteUrl("/dashboard?checkout=cancelled"),
  });

  redirect(checkoutUrl);
}

/**
 * Redirect to Stripe Customer Portal
 */
export async function openCustomerPortal() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get customer from database
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, user.id))
    .limit(1);

  if (!customer) {
    throw new Error("No billing account found");
  }

  const portalUrl = await createCustomerPortalSession(
    customer.stripeCustomerId,
    absoluteUrl("/dashboard/billing")
  );

  redirect(portalUrl);
}

/**
 * Get user's current subscription
 */
export async function getCurrentSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  return subscription;
}
