/**
 * Email Templates
 * 
 * Professional HTML email templates for transactional emails.
 * These templates use inline styles for maximum email client compatibility.
 */

interface EmailTemplateProps {
  name?: string
  planName?: string
  dashboardUrl?: string
  supportUrl?: string
}

export function WelcomeEmailTemplate({ name, dashboardUrl = "https://example.com/dashboard" }: EmailTemplateProps) {
  const userName = name || "there"
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SaaS Starter Kit</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to SaaS Starter Kit!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hi ${userName},
              </p>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for signing up! We're excited to have you on board. Your account has been successfully created and you're all set to get started.
              </p>
              
              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                Here's what you can do next:
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.8;">
                <li>Explore your dashboard and customize your profile</li>
                <li>Check out our features and see what's available</li>
                <li>Upgrade to a paid plan to unlock premium features</li>
                <li>Reach out if you need any help getting started</li>
              </ul>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${dashboardUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Go to Dashboard</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                If you have any questions, feel free to reply to this email or visit our support center.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                © ${new Date().getFullYear()} SaaS Starter Kit. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function SubscriptionConfirmationEmailTemplate({
  name,
  planName = "Pro",
  dashboardUrl = "https://example.com/dashboard",
  supportUrl = "https://example.com/support",
}: EmailTemplateProps) {
  const userName = name || "there"
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🎉 Subscription Confirmed!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Hi ${userName},
              </p>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Great news! Your subscription to the <strong>${planName}</strong> plan has been successfully activated. You now have access to all premium features.
              </p>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px;">
                <p style="margin: 0; color: #166534; font-size: 15px; font-weight: 600;">
                  ✓ Your ${planName} subscription is now active
                </p>
                <p style="margin: 10px 0 0; color: #166534; font-size: 14px;">
                  You can manage your subscription, update payment methods, and view billing history from your dashboard.
                </p>
              </div>
              
              <p style="margin: 30px 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                What's next?
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.8;">
                <li>Explore all the premium features now available to you</li>
                <li>Set up your account and customize your preferences</li>
                <li>Check out our documentation to get the most out of your subscription</li>
                <li>Reach out to our support team if you need any assistance</li>
              </ul>
              
              <!-- CTA Buttons -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td style="text-align: center; padding-bottom: 15px;">
                    <a href="${dashboardUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Go to Dashboard</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <a href="${supportUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #667eea; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; border: 2px solid #667eea;">Get Support</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Thank you for your subscription! We're here to help you succeed.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                © ${new Date().getFullYear()} SaaS Starter Kit. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
