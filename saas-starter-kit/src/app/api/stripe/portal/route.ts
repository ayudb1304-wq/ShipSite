import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCustomerPortalSession } from "@/lib/stripe/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { absoluteUrl } from "@/lib/utils";

/**
 * POST /api/stripe/portal
 * 
 * Creates a Stripe Customer Portal session for managing subscriptions.
 */
export async function POST() {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get customer from database
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, user.id))
      .limit(1);

    if (!customer) {
      return NextResponse.json(
        { error: "No billing account found. Please subscribe to a plan first." },
        { status: 400 }
      );
    }

    // Create portal session
    const returnUrl = absoluteUrl("/dashboard/billing");
    const portalUrl = await createCustomerPortalSession(
      customer.stripeCustomerId,
      returnUrl
    );

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
