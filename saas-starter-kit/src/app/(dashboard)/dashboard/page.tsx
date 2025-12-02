import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Zap, 
  CreditCard, 
  Settings, 
  ArrowRight,
  TrendingUp,
  Users,
  Activity
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your SaaS dashboard overview.",
};

interface Profile {
  full_name: string | null;
  is_pro: boolean;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Layout handles redirect
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  const firstName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your account and what&apos;s happening.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.is_pro ? "Pro" : "Free"}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.is_pro ? "All features unlocked" : "Upgrade for more features"}
            </p>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              API calls this month
            </p>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              From last month
            </p>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Active members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Manage Billing
            </CardTitle>
            <CardDescription>
              View invoices, update payment method, or change your plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/billing">
              <Button variant="outline" className="gap-2">
                Go to Billing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Update your profile, preferences, and account settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="gap-2">
                Go to Settings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5" />
        </Card>

        {!profile?.is_pro && (
          <Card className="relative overflow-hidden border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <Badge className="w-fit mb-2" variant="default">
                Recommended
              </Badge>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Upgrade to Pro
              </CardTitle>
              <CardDescription>
                Unlock all features and get priority support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/#pricing">
                <Button variant="gradient" className="gap-2">
                  View Plans
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest actions and events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Signed in", time: "Just now", icon: "🔐" },
              { action: "Updated profile", time: "2 hours ago", icon: "✏️" },
              { action: "API key generated", time: "1 day ago", icon: "🔑" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
