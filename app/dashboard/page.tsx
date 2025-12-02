import { getUser } from "@/actions/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { getUserPlan, formatPrice } from "@/lib/subscriptions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTodos } from "@/actions/todos"
import { TodoList } from "@/components/todo-list"

export const metadata = {
  title: "Dashboard",
  description: "Your dashboard",
}

export default async function DashboardPage() {
  const user = await getUser()
  const userPlan = await getUserPlan()
  const todos = await getTodos()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.profile?.fullName || user.email}!
          </p>
        </div>
        {userPlan.plan === "free" && (
          <Button asChild>
            <Link href="/pricing">Upgrade Plan</Link>
          </Button>
        )}
      </div>

      <div className="mb-6 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current Plan</p>
            <p className="text-2xl font-bold capitalize">{userPlan.plan}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-sm font-medium capitalize">{userPlan.status}</p>
          </div>
        </div>
      </div>

      {/* Start Here Card */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🚀</span>
            <span>Start Here</span>
          </CardTitle>
          <CardDescription>
            Welcome to your dashboard! This is a production-ready SaaS starter kit. Below you'll find example features
            and placeholder stats that you can customize for your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Quick Links:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <Link href="/dashboard/profile" className="text-primary hover:underline">
                  Update your profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard/billing" className="text-primary hover:underline">
                  Manage billing & subscription
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-primary hover:underline">
                  View pricing plans
                </Link>
              </li>
            </ul>
            <p className="pt-2 text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Check out the Todo List example below to see how CRUD operations work with Server Actions!
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">You are online</p>
          </CardContent>
        </Card>
      </div>

      {/* Todo List Example */}
      <div className="mt-6">
        <TodoList initialTodos={todos} />
      </div>
    </div>
  )
}
