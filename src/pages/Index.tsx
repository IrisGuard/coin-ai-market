
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import DirectDealerAccessButton from '@/components/navigation/DirectDealerAccessButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <ServicesSection />
      <Footer />
      <DirectDealerAccessButton />
    </div>
  );
};

export default Index;
