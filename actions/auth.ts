"use server"

/**
 * Authentication Server Actions
 * 
 * Handles user authentication including:
 * - Email magic link sign-in
 * - Email/password sign-up
 * - Google OAuth
 * - User session management
 */

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { env } from "@/env.mjs"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
})

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()

  const result = signInSchema.safeParse({
    email: formData.get("email"),
  })

  if (!result.success) {
    return {
      error: result.error.errors[0]?.message || "Invalid input",
    }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.email,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
      success: true,
      message: "Check your email for the magic link!",
    }
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()

  const result = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  })

  if (!result.success) {
    return {
      error: result.error.errors[0]?.message || "Invalid input",
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: {
        full_name: result.data.fullName || "",
      },
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  // Create profile if user was created
  if (data.user) {
    try {
      await db.insert(profiles).values({
        userId: data.user.id,
        email: data.user.email!,
        fullName: result.data.fullName || null,
        avatarUrl: data.user.user_metadata?.avatar_url || null,
      })
    } catch (profileError) {
      // Profile might already exist, which is fine
      console.error("Profile creation error:", profileError)
    }
  }

  return {
    success: true,
    message: "Check your email to confirm your account!",
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/sign-in")
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get profile from database
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1)

  return {
    ...user,
    profile,
  }
}
