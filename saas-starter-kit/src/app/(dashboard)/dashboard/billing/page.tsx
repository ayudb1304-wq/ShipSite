import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS, getPlanByPriceId } from "@/lib/stripe/config";
import { formatCurrency, formatDate } from "@/lib/utils";
import { openCustomerPortal } from "@/actions/billing";
import { CreditCard, Zap, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your subscription and billing.",
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Should be handled by layout redirect
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: { is_pro: boolean } | null };

  // Get current subscription
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  const currentPlan = subscription 
    ? getPlanByPriceId(subscription.priceId) 
    : PRICING_PLANS[0]; // Starter/Free plan

  const isActive = subscription && ["active", "trialing"].includes(subscription.status);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Plan */}
        <Card className="relative overflow-hidden">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Your current subscription details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{currentPlan?.name || "Free"}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentPlan?.description}
                </p>
              </div>
              <Badge variant={isActive ? "default" : "secondary"}>
                {subscription?.status || "Free"}
              </Badge>
            </div>

            {subscription && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {subscription.cancelAtPeriodEnd ? "Cancels on" : "Renews on"}:
                  </span>
                  <span className="font-medium">
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
                {subscription.cancelAtPeriodEnd && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Your subscription will not renew</span>
                  </div>
                )}
              </div>
            )}

            {subscription ? (
              <form action={openCustomerPortal}>
                <Button type="submit" variant="outline" className="w-full gap-2">
                  <CreditCard className="h-4 w-4" />
                  Manage Subscription
                </Button>
              </form>
            ) : (
              <Link href="/#pricing">
                <Button className="w-full gap-2">
                  <Zap className="h-4 w-4" />
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>
              What&apos;s included in your plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {currentPlan?.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Options */}
      {!profile?.is_pro && (
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Upgrade Your Plan
            </CardTitle>
            <CardDescription>
              Get access to all features and priority support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {PRICING_PLANS.filter(p => p.id !== "starter").map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{plan.name}</h4>
                    {plan.popular && (
                      <Badge variant="default" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold">
                      {formatCurrency(plan.prices.monthly.amount)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <Link href="/#pricing">
                    <Button 
                      variant={plan.popular ? "default" : "outline"} 
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <form action={openCustomerPortal}>
              <Button type="submit" variant="outline">
                View Invoices in Stripe Portal
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              No billing history available. Upgrade to a paid plan to see invoices.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
