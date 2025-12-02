"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn, formatCurrency } from "@/lib/utils";
import { PRICING_PLANS } from "@/lib/stripe/config";
import { Check, Zap, ArrowRight } from "lucide-react";

interface PricingTableProps {
  userId?: string;
}

export function PricingTable({ userId }: PricingTableProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleCheckout(priceId: string) {
    if (!priceId) {
      // Free tier - redirect to dashboard or sign up
      window.location.href = userId ? "/dashboard" : "/sign-in";
      return;
    }

    if (!userId) {
      // Redirect to sign in first
      window.location.href = `/sign-in?redirect=/api/stripe/checkout?priceId=${priceId}`;
      return;
    }

    setLoadingPlan(priceId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          mode: "subscription",
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoadingPlan(null);
    }
  }

  return (
    <section id="pricing" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Simple Pricing
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Start free, scale as you{" "}
            <span className="gradient-text">grow</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the perfect plan for your needs. All plans include a 14-day
            free trial with no credit card required.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Label
            htmlFor="billing-toggle"
            className={cn(
              "text-sm font-medium transition-colors",
              !isYearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label
            htmlFor="billing-toggle"
            className={cn(
              "text-sm font-medium transition-colors",
              isYearly ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Yearly
            <Badge variant="success" className="ml-2">
              Save 17%
            </Badge>
          </Label>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const price = isYearly ? plan.prices.yearly : plan.prices.monthly;
            const priceId = price.priceId;
            const isPopular = plan.popular;
            const isFree = plan.id === "starter";

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl border bg-card p-8 transition-all duration-300",
                  "hover:shadow-lg hover:-translate-y-1",
                  isPopular && "border-primary shadow-lg shadow-primary/10 scale-105 z-10"
                )}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1 py-1.5 px-4">
                      <Zap className="h-3.5 w-3.5" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan details */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      {isFree ? "Free" : formatCurrency(price.amount)}
                    </span>
                    {!isFree && (
                      <span className="text-muted-foreground">
                        /{isYearly ? "year" : "month"}
                      </span>
                    )}
                  </div>
                  {!isFree && isYearly && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(price.amount / 12)}/month billed annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full gap-2 mb-6"
                  variant={isPopular ? "gradient" : isFree ? "outline" : "default"}
                  size="lg"
                  onClick={() => handleCheckout(priceId)}
                  disabled={loadingPlan === priceId}
                >
                  {loadingPlan === priceId ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      {isFree ? "Get Started" : "Start Free Trial"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Money-back guarantee */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          All paid plans include a 14-day free trial.{" "}
          <span className="text-foreground font-medium">
            No credit card required.
          </span>
        </p>
      </div>
    </section>
  );
}
