"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getUser } from "@/actions/auth"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { eq } from "drizzle-orm"

const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
})

export async function updateProfile(formData: FormData) {
  const user = await getUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  const result = updateProfileSchema.safeParse({
    fullName: formData.get("fullName"),
  })

  if (!result.success) {
    return {
      error: result.error.errors[0]?.message || "Invalid input",
    }
  }

  try {
    await db
      .update(profiles)
      .set({
        fullName: result.data.fullName || null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, user.id))

    revalidatePath("/dashboard/profile")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Profile updated successfully!",
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return {
      error: "Failed to update profile",
    }
  }
}
