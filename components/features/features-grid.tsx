import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Shield,
  Zap,
  Lock,
  Globe,
  CreditCard,
  BarChart3,
  Mail,
  Code,
} from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Authentication",
    description:
      "Built-in auth with Supabase. Support for email, magic links, and OAuth providers.",
    className: "md:col-span-2",
  },
  {
    icon: CreditCard,
    title: "Stripe Integration",
    description:
      "Complete payment infrastructure with subscriptions, one-time payments, and customer portal.",
    className: "md:col-span-1",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on Next.js 14 with App Router for optimal performance and SEO.",
    className: "md:col-span-1",
  },
  {
    icon: Lock,
    title: "Type-Safe",
    description:
      "Full TypeScript support with strict mode. Zod validation for all inputs.",
    className: "md:col-span-1",
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description:
      "Automatic sitemap generation, robots.txt, and OpenGraph metadata.",
    className: "md:col-span-1",
  },
  {
    icon: BarChart3,
    title: "Analytics Ready",
    description:
      "PostHog integration for product analytics and user insights.",
    className: "md:col-span-1",
  },
  {
    icon: Mail,
    title: "Email System",
    description:
      "Resend integration for transactional emails and notifications.",
    className: "md:col-span-1",
  },
  {
    icon: Code,
    title: "Developer Experience",
    description:
      "Clean code, modular architecture, and comprehensive documentation.",
    className: "md:col-span-2",
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="container space-y-6 py-20 md:py-32">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Everything You Need to Launch
        </h2>
        <p className="max-w-[750px] text-lg text-muted-foreground">
          All the essential features and integrations you need to build and
          launch your SaaS product quickly.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card
              key={index}
              className={`${feature.className} transition-all hover:shadow-lg`}
            >
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
