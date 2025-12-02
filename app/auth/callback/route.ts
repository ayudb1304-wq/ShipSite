import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error)}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Auth callback error:", exchangeError)
      return NextResponse.redirect(
        new URL(
          `/sign-in?error=${encodeURIComponent(exchangeError.message)}`,
          requestUrl.origin
        )
      )
    }

    if (data.user) {
      try {
        // Ensure profile exists (trigger should handle this, but we check as fallback)
        const [existingProfile] = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, data.user.id))
          .limit(1)

        if (!existingProfile) {
          // Create profile if it doesn't exist (fallback if trigger didn't fire)
          await db.insert(profiles).values({
            userId: data.user.id,
            email: data.user.email!,
            fullName:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              null,
            avatarUrl: data.user.user_metadata?.avatar_url || null,
          })
        }
      } catch (profileError) {
        // Log error but don't block authentication
        console.error("Profile creation error:", profileError)
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
