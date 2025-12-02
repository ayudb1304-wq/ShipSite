import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/features/hero-section"
import { FeaturesGrid } from "@/components/features/features-grid"
import { PricingSection } from "@/components/features/pricing-section"
import { FAQSection } from "@/components/features/faq-section"
import { CTASection } from "@/components/features/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
