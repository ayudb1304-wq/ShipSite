import { PLANS } from "@/lib/config"
import type { PlanType } from "@/lib/config"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { createCheckoutSession } from "@/actions/payments"
import { getUserPlan, formatPrice } from "@/lib/subscriptions"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Pricing",
  description: "Choose the perfect plan for your needs",
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const params = await searchParams
  const userPlan = await getUserPlan()

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that&apos;s right for you
          </p>
        </div>

        {params?.success && (
          <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-green-500/15 p-4 text-center text-green-600">
            Payment successful! Your subscription is now active.
          </div>
        )}

        {params?.canceled && (
          <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-yellow-500/15 p-4 text-center text-yellow-600">
            Payment was canceled. You can try again anytime.
          </div>
        )}

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {Object.entries(PLANS).map(([key, plan]) => {
            const isCurrentPlan = userPlan.plan === key.toLowerCase()
            const isPro = key === "PRO"

            return (
              <Card
                key={key}
                className={`relative ${isPro ? "border-primary shadow-lg" : ""}`}
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
                      {formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
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
                  {plan.price > 0 ? (
                    <form action={createCheckoutSession.bind(null, key as PlanType, false)} className="w-full">
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

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
