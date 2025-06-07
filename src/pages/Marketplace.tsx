
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { usePageView } from '@/hooks/usePageView';
import { useMarketplaceStats } from '@/hooks/useMarketplaceStats';
import { useMarketplaceState } from '@/hooks/useMarketplaceState';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import { usePerformanceMonitoring, useMemoryMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useDealerStores } from '@/hooks/useDealerStores';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from '@/components/ui/input';
import DealerStoresGrid from '@/components/marketplace/DealerStoresGrid';

const Marketplace = () => {
  usePageView();
  usePerformanceMonitoring('Marketplace');
  useMemoryMonitoring();
  
  const [searchTerm, setSearchTerm] = useState('');
  const { stats, loading: statsLoading } = useMarketplaceStats();
  const { cacheInfo } = useCachedMarketplaceData();
  const { data: dealerStores = [], isLoading: dealersLoading } = useDealerStores();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-4">
                Dealer Marketplace
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Browse verified coin dealers and their collections
              </p>
              
              {/* Search */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search dealers by name, location, or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </motion.div>

            {/* Dealer Stores Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DealerStoresGrid 
                stores={dealerStores}
                isLoading={dealersLoading}
                searchTerm={searchTerm}
              />
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Marketplace;
