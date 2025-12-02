/**
 * Email Utility Functions
 * 
 * Functions to send transactional emails using Resend.
 */

import { resend } from "@/lib/resend"
import { env } from "@/env.mjs"
import { WelcomeEmailTemplate, SubscriptionConfirmationEmailTemplate } from "./templates"

interface SendWelcomeEmailParams {
  to: string
  name?: string
}

interface SendSubscriptionConfirmationEmailParams {
  to: string
  name?: string
  planName?: string
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail({ to, name }: SendWelcomeEmailParams) {
  try {
    // Note: Update the 'from' email address to match your verified Resend domain
    // For example: 'onboarding@yourdomain.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL || `onboarding@${env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, "").replace(/\/$/, "").replace(/:\d+$/, "")}`
    
    const { data, error } = await resend.emails.send({
      from: `SaaS Starter Kit <${fromEmail}>`,
      to: [to],
      subject: "Welcome to SaaS Starter Kit! 🎉",
      html: WelcomeEmailTemplate({
        name,
        dashboardUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }),
    })

    if (error) {
      console.error("Failed to send welcome email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send a subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail({
  to,
  name,
  planName = "Pro",
}: SendSubscriptionConfirmationEmailParams) {
  try {
    // Note: Update the 'from' email address to match your verified Resend domain
    // For example: 'billing@yourdomain.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL || `billing@${env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, "").replace(/\/$/, "").replace(/:\d+$/, "")}`
    
    const { data, error } = await resend.emails.send({
      from: `SaaS Starter Kit <${fromEmail}>`,
      to: [to],
      subject: `🎉 Your ${planName} Subscription is Active!`,
      html: SubscriptionConfirmationEmailTemplate({
        name,
        planName,
        dashboardUrl: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
        supportUrl: `${env.NEXT_PUBLIC_APP_URL}/support`,
      }),
    })

    if (error) {
      console.error("Failed to send subscription confirmation email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending subscription confirmation email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
