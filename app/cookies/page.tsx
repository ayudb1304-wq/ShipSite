import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for SaaS Starter Kit",
}

export default function CookiesPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Cookie Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website.
              They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p className="text-muted-foreground mb-2">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Required for the website to function properly. These include authentication
                cookies that keep you logged in and session cookies that maintain your session state.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting
                and reporting information anonymously (if PostHog or similar analytics are enabled).
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your preferences and settings to provide a personalized experience.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
              <p className="text-muted-foreground mb-2">
                These cookies are necessary for the website to function and cannot be switched off. They are usually set in
                response to actions made by you, such as:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Setting your privacy preferences</li>
                <li>Logging in to your account</li>
                <li>Filling in forms</li>
                <li>Maintaining your session</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Analytics Cookies (Optional)</h3>
              <p className="text-muted-foreground">
                If you have enabled PostHog or similar analytics services, these cookies help us understand how visitors
                use our website. The information is collected anonymously and used to improve the website's functionality.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground mb-2">
              In addition to our own cookies, we may also use various third-party cookies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Supabase:</strong> Uses cookies for authentication and session management
              </li>
              <li>
                <strong>Stripe:</strong> Uses cookies for payment processing and fraud prevention
              </li>
              <li>
                <strong>PostHog (if enabled):</strong> Uses cookies for analytics and product insights
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
            <p className="text-muted-foreground mb-2">
              You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies
              can impact your user experience and parts of our website may no longer be fully accessible.
            </p>
            <p className="text-muted-foreground mb-2">Most browsers allow you to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>See what cookies you have and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from particular sites</li>
              <li>Block all cookies from being set</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can find out more about how to manage cookies in your browser's help documentation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Changes to This Cookie Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other
              operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed
              about our use of cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about our use of cookies, please contact us at privacy@example.com
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            <strong>Note:</strong> This is a generic cookie policy template. Please review and customize it according to your
            specific needs and legal requirements. Consider consulting with a legal professional to ensure compliance with
            applicable privacy laws (GDPR, ePrivacy Directive, etc.).
          </p>
        </div>
      </div>
    </div>
  )
}
