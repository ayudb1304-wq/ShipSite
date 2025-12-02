"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/actions/profile"

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface UpdateProfileFormProps {
  user: {
    profile?: {
      fullName?: string | null
    } | null
  }
}

export function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.profile?.fullName || "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    if (data.fullName) {
      formData.append("fullName", data.fullName)
    }

    const result = await updateProfile(formData)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({ type: "success", text: result.message || "Profile updated successfully!" })
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...register("fullName")}
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>
      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-destructive"
          }`}
        >
          {message.text}
        </p>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}
