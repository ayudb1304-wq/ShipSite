import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="container space-y-6 py-20 md:py-32">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 rounded-lg border bg-card p-12 text-center shadow-lg">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Ready to Build Your SaaS?
        </h2>
        <p className="max-w-[750px] text-lg text-muted-foreground">
          Get started today and launch your product in days, not months. No credit
          card required.
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
      </div>
    </section>
  )
}
