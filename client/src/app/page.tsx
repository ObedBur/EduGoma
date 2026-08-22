import React from "react";
import { Header } from "../components/layout/Header";
import { HeroSection } from "../components/sections/HeroSection";
import { ChallengesSection } from "../components/sections/ChallengesSection";
import { PlatformOverviewSection } from "../components/sections/PlatformOverviewSection";
import { FeaturesByRoleSection } from "../components/sections/FeaturesByRoleSection";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";
import { WhyChooseSection } from "../components/sections/WhyChooseSection";
import { SocialProofBanner } from "../components/sections/SocialProofBanner";
import { FinalCTASection } from "../components/sections/FinalCTASection";
import { Footer } from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <ChallengesSection />
        <PlatformOverviewSection />
        <FeaturesByRoleSection />
        <HowItWorksSection />
        <WhyChooseSection />
        <SocialProofBanner />
        <FinalCTASection />
      </main>
      
      <Footer />
    </div>
  );
}
