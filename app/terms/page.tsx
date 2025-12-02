import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for SaaS Starter Kit",
}

export default function TermsPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using SaaS Starter Kit, you agree to be bound by these Terms of Service and all applicable
              laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-2">
              Permission is granted to temporarily use SaaS Starter Kit for personal or commercial purposes. This is the grant
              of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose without authorization</li>
              <li>Attempt to reverse engineer any software contained in the service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Subscription and Payment</h2>
            <p className="text-muted-foreground mb-2">
              Our service offers various subscription plans. By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Pay all fees associated with your selected plan</li>
              <li>Provide accurate billing information</li>
              <li>Authorize us to charge your payment method</li>
              <li>Understand that subscriptions auto-renew unless canceled</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Payments are processed securely through Stripe. Refunds are handled according to our refund policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
            <p className="text-muted-foreground mb-2">You may not use our service:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, or laws</li>
              <li>To infringe upon or violate our intellectual property rights or the rights of others</li>
              <li>To harass, abuse, insult, harm, defame, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
            <p className="text-muted-foreground">
              The materials on SaaS Starter Kit are provided on an "as is" basis. We make no warranties, expressed or implied,
              and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              In no event shall SaaS Starter Kit or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use
              the materials on our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting
              the new Terms of Service on this page. Your continued use of the service after such modifications constitutes
              your acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at legal@example.com
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            <strong>Note:</strong> This is a generic terms of service template. Please review and customize it according to your
            specific needs and legal requirements. Consider consulting with a legal professional to ensure compliance with
            applicable laws.
          </p>
        </div>
      </div>
    </div>
  )
}
