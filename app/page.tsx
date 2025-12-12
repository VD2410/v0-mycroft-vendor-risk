import { LandingHero } from "@/components/landing/landing-hero"
import { LandingNav } from "@/components/landing/landing-nav"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SignalsSection } from "@/components/landing/signals-section"
import { ExampleScorecard } from "@/components/landing/example-scorecard"
import { ComplianceSection } from "@/components/landing/compliance-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNav />
      <LandingHero />
      <HowItWorks />
      <SignalsSection />
      <ExampleScorecard />
      <ComplianceSection />
      <PricingSection />
      <LandingFooter />
    </main>
  )
}
