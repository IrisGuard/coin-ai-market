
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuickActionsSection from "@/components/QuickActionsSection";
import ServicesSection from "@/components/ServicesSection";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";

const Index = () => {
  usePageView();

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <QuickActionsSection />
      <ServicesSection />
      <FeatureSection />
      <Footer />
    </div>
  );
};

export default Index;
