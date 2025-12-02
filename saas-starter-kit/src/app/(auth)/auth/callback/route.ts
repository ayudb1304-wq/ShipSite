import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";

/**
 * Auth Callback Route
 * 
 * Handles the OAuth and Magic Link callback from Supabase.
 * Creates a user profile if one doesn't exist.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if profile exists, create if not
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existingProfile) {
        // Create new profile
        try {
          await db.insert(profiles).values({
            id: data.user.id,
            email: data.user.email!,
            fullName: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
            avatarUrl: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
          });
        } catch (dbError) {
          console.error("Error creating profile:", dbError);
          // Continue even if profile creation fails - it can be created later
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/sign-in?error=Could not authenticate user`);
}
