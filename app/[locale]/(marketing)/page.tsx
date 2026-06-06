import { HeroSection } from "@/components/landing/HeroSection"
import { DocumentVerifySection } from "@/components/landing/DocumentVerifySection"
import { TrustedByMarquee } from "@/components/landing/TrustedByMarquee"
import { ProblemSection } from "@/components/landing/ProblemSection"
import { FeatureGrid } from "@/components/landing/FeatureGrid"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { IsoTimeline } from "@/components/landing/IsoTimeline"
import { ComparisonTable } from "@/components/landing/ComparisonTable"
import { FooterCTA } from "@/components/landing/FooterCTA"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <DocumentVerifySection />
      <TrustedByMarquee />
      <ProblemSection />
      <FeatureGrid />
      <HowItWorks />
      <IsoTimeline />
      <ComparisonTable />
      <FooterCTA />
      <LandingFooter />
    </>
  )
}
