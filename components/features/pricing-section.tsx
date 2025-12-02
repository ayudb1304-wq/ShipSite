"use client"

import { useState } from "react"
import { STRIPE_PLANS } from "@/lib/config"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { createCheckoutSession } from "@/actions/stripe"
import { formatPrice } from "@/lib/subscriptions"
import Link from "next/link"

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="container space-y-6 py-20 md:py-32">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Simple, Transparent Pricing
        </h2>
        <p className="max-w-[750px] text-lg text-muted-foreground">
          Choose the plan that&apos;s right for you. All plans include a 14-day free trial.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isYearly ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>
            Yearly
            <span className="ml-2 text-xs text-green-600">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {Object.entries(STRIPE_PLANS).map(([key, plan]) => {
          const isCurrentPlan = false // You can add logic to check user's current plan
          const isPro = key === "PRO"
          const priceId = isYearly && plan.priceIdYearly ? plan.priceIdYearly : plan.priceId
          const displayPrice = isYearly && plan.price > 0 ? plan.price * 12 * 0.8 : plan.price

          return (
            <Card
              key={key}
              className={`relative ${isPro ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Best Value
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">
                    {formatPrice(displayPrice)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">
                      /{isYearly ? "year" : "month"}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {priceId ? (
                  <form action={createCheckoutSession.bind(null, priceId)} className="w-full">
                    <Button
                      type="submit"
                      variant={isPro ? "default" : "outline"}
                      className="w-full"
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? "Current Plan" : "Get Started"}
                    </Button>
                  </form>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="mx-auto mt-12 max-w-2xl text-center">
        <p className="text-sm text-muted-foreground">
          All plans include a 14-day free trial. No credit card required.{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Start your free trial
          </Link>
        </p>
      </div>
    </section>
  )
}
