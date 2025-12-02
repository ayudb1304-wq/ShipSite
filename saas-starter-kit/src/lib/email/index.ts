import { Resend } from "resend";

/**
 * Resend Email Client
 * 
 * Handles all transactional email sending.
 */

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const FROM_NAME = "SaaSKit";

/**
 * Send a welcome email to new users
 */
export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: "Welcome to SaaSKit! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #8B5CF6, #14B8A6); border-radius: 12px; line-height: 50px; font-size: 24px; font-weight: bold; color: white;">
                S
              </div>
            </div>
            
            <h1 style="font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 20px;">
              Welcome to SaaSKit, ${name}! 🎉
            </h1>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thanks for signing up! We're excited to have you on board.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Here are a few things you can do to get started:
            </p>
            
            <ul style="font-size: 16px; margin-bottom: 30px;">
              <li>Complete your profile</li>
              <li>Explore the dashboard</li>
              <li>Check out our documentation</li>
              <li>Upgrade to Pro for more features</li>
            </ul>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #8B5CF6, #14B8A6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Go to Dashboard
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              If you have any questions, just reply to this email. We're always happy to help!
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} SaaSKit. All rights reserved.
            </p>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
}

/**
 * Send a subscription confirmation email
 */
export async function sendSubscriptionEmail({
  email,
  name,
  planName,
}: {
  email: string;
  name: string;
  planName: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `You're now on ${planName}! 🚀`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #8B5CF6, #14B8A6); border-radius: 12px; line-height: 50px; font-size: 24px; font-weight: bold; color: white;">
                S
              </div>
            </div>
            
            <h1 style="font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 20px;">
              Welcome to ${planName}! 🚀
            </h1>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Hey ${name},
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Your subscription to the <strong>${planName}</strong> plan is now active. Thank you for upgrading!
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              You now have access to all the premium features. Enjoy!
            </p>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #8B5CF6, #14B8A6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Go to Dashboard
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} SaaSKit. All rights reserved.
            </p>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Failed to send subscription email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending subscription email:", error);
    return { success: false, error };
  }
}
