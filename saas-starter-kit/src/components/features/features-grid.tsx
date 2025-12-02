import { cn } from "@/lib/utils";
import { 
  Zap, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard, 
  Mail,
  Database,
  BarChart,
  type LucideIcon
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built on Next.js 14+ with App Router for blazing fast performance and optimal SEO.",
    className: "md:col-span-2",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "Supabase Auth with Google OAuth and Magic Link. Session management handled automatically.",
  },
  {
    icon: CreditCard,
    title: "Stripe Payments",
    description: "Accept payments with Stripe Checkout, manage subscriptions, and handle webhooks.",
  },
  {
    icon: Database,
    title: "Type-Safe Database",
    description: "Drizzle ORM with Supabase PostgreSQL. Full TypeScript support with zero runtime overhead.",
    className: "md:col-span-2",
  },
  {
    icon: Mail,
    title: "Transactional Emails",
    description: "Send beautiful emails with Resend. Welcome emails, receipts, and notifications ready to go.",
  },
  {
    icon: BarChart,
    title: "Analytics Ready",
    description: "PostHog integration for product analytics. Track user behavior and optimize conversion.",
  },
  {
    icon: Palette,
    title: "Beautiful UI",
    description: "Shadcn/UI components with Tailwind CSS. Dark mode, animations, and accessibility built-in.",
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description: "Metadata, OpenGraph images, sitemap, and robots.txt. Everything you need to rank.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to{" "}
            <span className="gradient-text">ship faster</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stop reinventing the wheel. Start with a production-ready foundation
            and focus on what makes your product unique.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300",
                  "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
                  feature.className
                )}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
                
                {/* Content */}
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner decoration */}
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
              </div>
            );
          })}
        </div>

        {/* Tech Stack Logos */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">Built with the best tools</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            {["Next.js", "TypeScript", "Tailwind", "Supabase", "Stripe", "Drizzle"].map(
              (tech) => (
                <div
                  key={tech}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
