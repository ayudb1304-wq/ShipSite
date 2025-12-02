# Code Examples

Practical examples for common tasks in the SaaS Starter Kit.

## Creating a New Server Action

```typescript
// actions/example.ts
"use server"

import { z } from "zod"
import { getUser } from "@/actions/auth"
import { db } from "@/db"
import { revalidatePath } from "next/cache"

const exampleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
})

export async function createExample(formData: FormData) {
  // 1. Verify authentication
  const user = await getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  // 2. Validate input
  const result = exampleSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  })

  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Invalid input" }
  }

  // 3. Perform operation
  try {
    // Database operation, API call, etc.
    // await db.insert(...)
    
    // 4. Revalidate if needed
    revalidatePath("/dashboard")
    
    return { success: true, message: "Created successfully" }
  } catch (error) {
    console.error("Error:", error)
    return { error: "Failed to create" }
  }
}
```

## Using Server Actions in Forms

```tsx
// app/example/page.tsx
import { createExample } from "@/actions/example"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ExamplePage() {
  return (
    <form action={createExample}>
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Creating a Protected Page

```tsx
// app/dashboard/example/page.tsx
import { getUser } from "@/actions/auth"
import { redirect } from "next/navigation"

export default async function ExamplePage() {
  const user = await getUser()
  
  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  )
}
```

## Creating a Client Component with State

```tsx
// components/example-counter.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ExampleCounter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </div>
  )
}
```

## Database Query Example

```typescript
// actions/example.ts
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUserProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1)

  return profile
}
```

## Creating a New Database Table

```typescript
// db/schema.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const examples = pgTable("examples", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Example = typeof examples.$inferSelect
export type NewExample = typeof examples.$inferInsert
```

Then run:
```bash
npm run db:generate
npm run db:push
```

## Adding a New Shadcn Component

```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
```

## Creating a Modal/Dialog

```tsx
// components/example-dialog.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ExampleDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Example Dialog</DialogTitle>
          <DialogDescription>
            This is an example dialog component.
          </DialogDescription>
        </DialogHeader>
        <p>Dialog content goes here.</p>
      </DialogContent>
    </Dialog>
  )
}
```

## Sending an Email

```typescript
// actions/email.ts
"use server"

import { resend } from "@/lib/resend"

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "onboarding@yourdomain.com",
      to: email,
      subject: "Welcome!",
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thanks for signing up.</p>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Email error:", error)
    return { error: "Failed to send email" }
  }
}
```

## Checking Subscription Status

```tsx
// app/dashboard/feature/page.tsx
import { getUserPlan } from "@/lib/subscriptions"
import { redirect } from "next/navigation"

export default async function FeaturePage() {
  const userPlan = await getUserPlan()

  // Check if user has access
  if (!userPlan.isPro) {
    redirect("/pricing")
  }

  return (
    <div>
      <h1>Pro Feature</h1>
      <p>This is only available for Pro users.</p>
    </div>
  )
}
```

## Creating a Form with Validation

```tsx
// components/example-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createExample } from "@/actions/example"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
})

type FormValues = z.infer<typeof formSchema>

export function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)

    const result = await createExample(formData)
    if (result.error) {
      alert(result.error)
    } else {
      alert("Success!")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
```

## Adding Environment Variables

1. Add to `.env.example`:
```bash
NEW_API_KEY=your_key_here
```

2. Add to `env.mjs`:
```typescript
const envSchema = z.object({
  // ... existing
  NEW_API_KEY: z.string().min(1),
})
```

3. Use in code:
```typescript
import { env } from "@/env.mjs"

const apiKey = env.NEW_API_KEY
```

## Creating a Custom Hook

```tsx
// hooks/use-example.ts
"use client"

import { useState, useEffect } from "react"

export function useExample() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch data
    fetchData().then(setData).finally(() => setLoading(false))
  }, [])

  return { data, loading }
}
```

## Error Boundary

```tsx
// app/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## Loading States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}
```

---

These examples demonstrate common patterns. Adapt them to your specific needs!
