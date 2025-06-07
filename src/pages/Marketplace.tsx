
import { usePageView } from '@/hooks/usePageView';
import { useMarketplaceStats } from '@/hooks/useMarketplaceStats';
import { usePerformanceMonitoring, useMemoryMonitoring } from '@/hooks/usePerformanceMonitoring';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnhancedMarketplaceRegistrationForm from "@/components/marketplace/EnhancedMarketplaceRegistrationForm";

const Marketplace = () => {
  usePageView();
  usePerformanceMonitoring('Marketplace');
  useMemoryMonitoring();
  
  const { stats, loading: statsLoading } = useMarketplaceStats();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <EnhancedMarketplaceRegistrationForm />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Marketplace;
