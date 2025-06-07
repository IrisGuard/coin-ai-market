
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import ServicesSection from '@/components/ServicesSection';
import QuickActionsSection from '@/components/QuickActionsSection';
import CategoryGrid from '@/components/CategoryGrid';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <FeatureSection />
      <ServicesSection />
      <QuickActionsSection />
      <Footer />
    </div>
  );
};

export default Index;
