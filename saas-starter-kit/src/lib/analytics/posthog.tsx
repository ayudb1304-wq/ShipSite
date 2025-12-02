"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

/**
 * PostHog Analytics Provider
 * 
 * Wraps your app to enable analytics tracking.
 * Only initializes in production with valid API key.
 */

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (posthogKey && posthogHost) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        // Disable in development
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") {
            posthog.opt_out_capturing();
          }
        },
        // Capture pageviews automatically
        capture_pageview: true,
        // Capture performance data
        capture_pageleave: true,
        // Don't capture personal data by default
        autocapture: {
          dom_event_allowlist: ["click", "submit"],
          url_allowlist: [".*"],
        },
      });
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  );
}

/**
 * Track custom events
 * 
 * @example
 * trackEvent("button_clicked", { button_name: "sign_up" });
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, properties);
  }
}

/**
 * Identify a user for tracking
 * 
 * @example
 * identifyUser(user.id, { email: user.email, name: user.name });
 */
export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined") {
    posthog.identify(userId, properties);
  }
}

/**
 * Reset user identification (on logout)
 */
export function resetUser() {
  if (typeof window !== "undefined") {
    posthog.reset();
  }
}
