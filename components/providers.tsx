"use client"

import { PostHogProvider } from "posthog-js/react"
import posthog from "posthog-js"

export function Providers({ children }: { children: React.ReactNode }) {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug()
      },
    })
  }

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  )
}
