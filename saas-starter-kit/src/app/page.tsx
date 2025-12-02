import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/features/header";
import { Hero } from "@/components/features/hero";
import { FeaturesGrid } from "@/components/features/features-grid";
import { PricingTable } from "@/components/features/pricing-table";
import { FAQ } from "@/components/features/faq";
import { Footer } from "@/components/features/footer";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero
          badge="Now in Public Beta"
          title="Ship your SaaS"
          highlight="in days, not months"
          description="The ultimate Next.js starter kit with authentication, payments, database, and beautiful UI components. Everything you need to launch your product."
          primaryCta={{
            text: "Get Started Free",
            href: user ? "/dashboard" : "/sign-in",
          }}
          secondaryCta={{
            text: "View on GitHub",
            href: "https://github.com",
          }}
          socialProof={{
            avatars: [
              "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
              "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
              "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
              "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
            ],
            text: "Loved by 1,000+ developers",
            rating: 5,
          }}
        />
        
        <FeaturesGrid />
        
        <PricingTable userId={user?.id} />
        
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
}
