import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What's included in the SaaS Starter Kit?",
    answer:
      "The kit includes authentication (Google OAuth & Magic Link), Stripe payments with subscription management, email notifications via Resend, PostHog analytics, a beautiful landing page with all the essential sections, a user dashboard, and more. Everything is fully typed with TypeScript and uses best practices.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes! We offer a generous free tier that includes up to 1,000 API calls per month, basic analytics, and email support. It's perfect for side projects and getting started.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your dashboard. Your access will continue until the end of your current billing period, and you won't be charged again.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the product for any reason, contact us within 30 days of your purchase for a full refund.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express) through Stripe. We also support Apple Pay and Google Pay where available.",
  },
  {
    question: "How do I get support?",
    answer:
      "Free tier users get email support. Pro users get priority email support with faster response times. Enterprise users get 24/7 phone support and a dedicated account manager.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can change your plan at any time. When upgrading, you'll be charged a prorated amount for the remainder of your billing period. When downgrading, the change takes effect at the start of your next billing period.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Security is our top priority. We use industry-standard encryption, secure authentication through Supabase, and never store sensitive payment information (handled by Stripe). All data is stored in SOC 2 Type II compliant infrastructure.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? Reach out to our support team.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Still have questions?{" "}
              <a
                href="mailto:support@example.com"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
