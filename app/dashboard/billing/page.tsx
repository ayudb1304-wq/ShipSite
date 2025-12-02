import { getUserPlan, formatPrice } from "@/lib/subscriptions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createCustomerPortalSession } from "@/actions/stripe"
import { STRIPE_PLANS } from "@/lib/config"
import { Check } from "lucide-react"
import { redirect } from "next/navigation"
import { getUser } from "@/actions/auth"

export const metadata = {
  title: "Billing",
  description: "Manage your subscription and billing",
}

export default async function BillingPage() {
  const user = await getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const userPlan = await getUserPlan()
  const currentPlan = STRIPE_PLANS[userPlan.plan.toUpperCase() as keyof typeof STRIPE_PLANS]

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">{currentPlan.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(currentPlan.price)}
                {currentPlan.price > 0 && "/month"}
              </p>
            </div>

            {userPlan.subscription && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">
                    {userPlan.subscription.status}
                  </span>
                </div>
                {userPlan.subscription.stripeCurrentPeriodEnd && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renews on:</span>
                    <span className="font-medium">
                      {new Date(
                        userPlan.subscription.stripeCurrentPeriodEnd
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4">
              <h3 className="mb-2 text-sm font-semibold">Plan Features:</h3>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <Check className="mr-2 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>
              Update your plan, payment method, or cancel your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use the Stripe Customer Portal to manage your subscription, update
              payment methods, view invoices, and more.
            </p>
            <form action={createCustomerPortalSession}>
              <Button type="submit" className="w-full">
                Open Customer Portal
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              You&apos;ll be redirected to Stripe to manage your subscription
              securely.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
