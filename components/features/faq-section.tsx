import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What's included in the starter kit?",
    answer:
      "The starter kit includes authentication (Supabase), payments (Stripe), database (PostgreSQL with Drizzle ORM), email (Resend), analytics (PostHog), and a complete UI component library. Everything is production-ready and fully typed.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "Yes, this is a code-based starter kit. You should be comfortable with React, TypeScript, and Next.js. However, the code is well-documented and modular, making it easy to customize.",
  },
  {
    question: "Can I use this for commercial projects?",
    answer:
      "Yes! This starter kit is designed to be used for commercial SaaS products. You own all the code and can customize it however you need.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "The starter kit uses Stripe, which supports all major credit cards, debit cards, and various payment methods depending on your region. Stripe handles all payment processing securely.",
  },
  {
    question: "How do I customize the design?",
    answer:
      "The design uses Tailwind CSS and Shadcn/UI components. You can easily customize colors, fonts, and layouts by modifying the Tailwind configuration and component files. All components are fully customizable.",
  },
  {
    question: "Is there support available?",
    answer:
      "This is a starter kit template. For support, you can refer to the documentation, check the code comments, or reach out through the repository issues. The codebase is designed to be self-explanatory with clear structure.",
  },
  {
    question: "Can I add more features?",
    answer:
      "Absolutely! The codebase is modular and designed for easy extension. You can add new features, integrate additional services, or modify existing functionality. The architecture supports scaling and customization.",
  },
  {
    question: "What's the tech stack?",
    answer:
      "Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Supabase (Auth + Database), Drizzle ORM, Stripe, Resend, PostHog, and Zod for validation. All modern, production-ready technologies.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="container space-y-6 py-20 md:py-32">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="max-w-[750px] text-lg text-muted-foreground">
          Everything you need to know about the SaaS Starter Kit.
        </p>
      </div>
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
