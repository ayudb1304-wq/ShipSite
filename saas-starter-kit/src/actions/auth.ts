"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { absoluteUrl } from "@/lib/utils";

/**
 * Authentication Server Actions
 * 
 * All authentication-related mutations go here.
 * Using Server Actions for better security and UX.
 */

// Validation schemas
const emailSchema = z.string().email("Please enter a valid email address");

const signInSchema = z.object({
  email: emailSchema,
});

// Action result type
type ActionResult = {
  error?: string;
  success?: boolean;
  message?: string;
};

/**
 * Sign in with Magic Link
 */
export async function signInWithMagicLink(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  const validatedFields = signInSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  const { email } = validatedFields.data;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: absoluteUrl("/auth/callback"),
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  return {
    success: true,
    message: "Check your email for the magic link!",
  };
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<ActionResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: absoluteUrl("/auth/callback"),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  if (data.url) {
    redirect(data.url);
  }

  return {
    error: "Something went wrong. Please try again.",
  };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Get the current user (for use in Server Components)
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get user profile with subscription status
 */
export async function getUserProfile() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
