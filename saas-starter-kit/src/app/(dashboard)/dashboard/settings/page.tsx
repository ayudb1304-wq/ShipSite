import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings.",
};

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  is_pro: boolean;
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Layout handles redirect
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  const name = profile?.full_name || user.user_metadata?.full_name || user.email || "User";
  const email = user.email || "";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your public profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-primary/10">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-muted-foreground">{email}</p>
                <Badge className="mt-2" variant={profile?.is_pro ? "default" : "secondary"}>
                  {profile?.is_pro ? "Pro Plan" : "Free Plan"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Your account details and authentication info.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <dt className="font-medium">User ID</dt>
                <dd className="text-muted-foreground font-mono text-sm">
                  {user?.id}
                </dd>
              </div>
              <div className="flex justify-between border-b pb-4">
                <dt className="font-medium">Email</dt>
                <dd className="text-muted-foreground">{email}</dd>
              </div>
              <div className="flex justify-between border-b pb-4">
                <dt className="font-medium">Auth Provider</dt>
                <dd className="text-muted-foreground capitalize">
                  {user?.app_metadata?.provider || "Email"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Member Since</dt>
                <dd className="text-muted-foreground">
                  {new Date(user?.created_at || "").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="text-sm text-destructive hover:underline">
              Delete my account
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
