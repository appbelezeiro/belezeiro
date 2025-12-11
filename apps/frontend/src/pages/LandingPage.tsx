import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingProblemSolution } from "@/components/landing/LandingProblemSolution";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingBenefits } from "@/components/landing/LandingBenefits";
import { LandingDemo } from "@/components/landing/LandingDemo";
import { LandingModules } from "@/components/landing/LandingModules";
import { LandingAISecretary } from "@/components/landing/LandingAISecretary";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingFooter } from "@/components/landing/LandingFooter";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingProblemSolution />
        <LandingHowItWorks />
        <LandingBenefits />
        <LandingDemo />
        <LandingModules />
        <LandingAISecretary />
        <LandingPricing />
        <LandingTestimonials />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
