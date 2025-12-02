import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container flex flex-col items-center justify-center gap-8 py-24">
        <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
          <h1 className="text-5xl font-bold mb-4">
            SaaS Starter Kit
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your production-ready SaaS boilerplate is ready to go!
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/pricing">View Pricing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-in">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
