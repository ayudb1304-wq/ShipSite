import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

export function HeroSection() {
  return (
    <section className="container space-y-6 py-20 md:py-32 lg:py-40">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
          <span className="mr-2">✨</span>
          <span className="text-muted-foreground">
            Production-ready SaaS boilerplate
          </span>
        </div>
        <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Build Your SaaS Faster
          <br />
          <span className="text-primary">Ship in Days, Not Months</span>
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          A complete starter kit with authentication, payments, and everything
          you need to launch your SaaS product. Built with Next.js, Supabase,
          and Stripe.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="group">
            <Link href="/sign-up">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Trusted by developers building the next generation of SaaS products
          </p>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
