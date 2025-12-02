import { getUserPlan } from "@/lib/subscriptions"
import { Badge } from "@/components/ui/badge"

export async function SubscriptionStatus() {
  const userPlan = await getUserPlan()

  const statusColors: Record<string, string> = {
    active: "bg-green-500",
    trialing: "bg-blue-500",
    past_due: "bg-yellow-500",
    canceled: "bg-gray-500",
    incomplete: "bg-orange-500",
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Plan:</span>
      <Badge variant="outline" className="capitalize">
        {userPlan.plan}
      </Badge>
      <Badge
        className={`${statusColors[userPlan.status] || "bg-gray-500"} text-white`}
      >
        {userPlan.status}
      </Badge>
    </div>
  )
}
