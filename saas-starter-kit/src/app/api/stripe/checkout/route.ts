import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { 
  createCheckoutSession, 
  createOneTimeCheckoutSession, 
  getOrCreateCustomer 
} from "@/lib/stripe/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { absoluteUrl } from "@/lib/utils";
import { z } from "zod";

const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  mode: z.enum(["subscription", "payment"]).default("subscription"),
});

/**
 * POST /api/stripe/checkout
 * 
 * Creates a Stripe Checkout Session for subscription or one-time payment.
 */
export async function POST(request: Request) {
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

    // Validate request body
    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { priceId, mode } = validation.data;

    // Get or create Stripe customer
    const stripeCustomerId = await getOrCreateCustomer(user.id, user.email!);

    // Store customer in database if not exists
    try {
      await db.insert(customers).values({
        id: user.id,
        stripeCustomerId,
      }).onConflictDoNothing();
    } catch (error) {
      console.error("Error storing customer:", error);
      // Continue anyway - customer might already exist
    }

    // Create checkout session
    const successUrl = absoluteUrl("/dashboard?checkout=success");
    const cancelUrl = absoluteUrl("/dashboard?checkout=cancelled");

    let checkoutUrl: string;

    if (mode === "subscription") {
      checkoutUrl = await createCheckoutSession({
        customerId: stripeCustomerId,
        priceId,
        successUrl,
        cancelUrl,
      });
    } else {
      checkoutUrl = await createOneTimeCheckoutSession({
        customerId: stripeCustomerId,
        priceId,
        successUrl,
        cancelUrl,
      });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
