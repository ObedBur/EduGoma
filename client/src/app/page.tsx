import React from "react";
import { Header } from "../components/layout/Header";
import { HeroSection } from "../components/sections/HeroSection";
import { PlatformOverviewSection } from "../components/sections/PlatformOverviewSection";
import { FeaturesByRoleSection } from "../components/sections/FeaturesByRoleSection";
import { ChallengesSection } from "../components/sections/ChallengesSection";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";
import { WhyChooseSection } from "../components/sections/WhyChooseSection";
import { SocialProofBanner } from "../components/sections/SocialProofBanner";
import { FinalCTASection } from "../components/sections/FinalCTASection";
import { Footer } from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full">
      <Header />
      
      <main className="flex-grow overflow-x-hidden">
        <HeroSection />
        <PlatformOverviewSection />
        <FeaturesByRoleSection />
        <ChallengesSection />
        <HowItWorksSection />
        <WhyChooseSection />
        <SocialProofBanner />
        <FinalCTASection />
      </main>
      
      <Footer />
    </div>
  );
}
