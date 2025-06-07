
import { usePageView } from '@/hooks/usePageView';
import { useMarketplaceStats } from '@/hooks/useMarketplaceStats';
import { useMarketplaceState } from '@/hooks/useMarketplaceState';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import { usePerformanceMonitoring, useMemoryMonitoring } from '@/hooks/usePerformanceMonitoring';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketplaceRegistrationForm from "@/components/marketplace/MarketplaceRegistrationForm";

const Marketplace = () => {
  usePageView();
  usePerformanceMonitoring('Marketplace');
  useMemoryMonitoring();
  
  const { stats, loading: statsLoading } = useMarketplaceStats();
  const { cacheInfo } = useCachedMarketplaceData();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <MarketplaceRegistrationForm />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Marketplace;
