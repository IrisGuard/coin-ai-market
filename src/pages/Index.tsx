
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AICapabilitiesShowcase from "@/components/showcase/AICapabilitiesShowcase";
import InteractiveAIDemo from "@/components/showcase/InteractiveAIDemo";
import QuickActionsSection from "@/components/QuickActionsSection";
import ServicesSection from "@/components/ServicesSection";
import FeatureSection from "@/components/FeatureSection";
import TrustIndicators from "@/components/showcase/TrustIndicators";
import Footer from "@/components/Footer";

const Index = () => {
  usePageView();

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AICapabilitiesShowcase />
      <InteractiveAIDemo />
      <QuickActionsSection />
      <ServicesSection />
      <FeatureSection />
      <TrustIndicators />
      <Footer />
    </div>
  );
};

export default Index;
