
import React, { useState } from 'react';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const COINS_PER_PAGE = 24;

const FeaturedCoinsSection = () => {
  const { coins, isLoading, error } = useCachedMarketplaceData();
  const [currentPage, setCurrentPage] = useState(1);

  // Filter for direct sale coins only (exclude auctions)
  const directSaleCoins = React.useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    return coins
      .filter(coin => 
        coin.authentication_status === 'verified' && 
        !coin.is_auction // ONLY direct sale coins
      )
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.views || 0) - (a.views || 0);
      });
  }, [coins]);

  const totalPages = Math.ceil(directSaleCoins.length / COINS_PER_PAGE);
  const startIndex = (currentPage - 1) * COINS_PER_PAGE;
  const endIndex = startIndex + COINS_PER_PAGE;
  const currentCoins = directSaleCoins.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-16">
            <div className="flex items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
              <span className="text-electric-blue">Φόρτωση νομισμάτων...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Αδυναμία φόρτωσης νομισμάτων. Προσπαθήστε ξανά αργότερα.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!directSaleCoins.length) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Δεν υπάρχουν διαθέσιμα νομίσματα προς πώληση</h3>
            <p className="text-gray-600">Ελέγξτε ξανά αργότερα για νέες καταχωρήσεις!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Επιλεγμένα Νομίσματα για Άμεση Πώληση
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Ανακαλύψτε {directSaleCoins.length.toLocaleString()} αυθεντικά νομίσματα από επιβεβαιωμένους dealers
          </p>
          <p className="text-sm text-gray-500">
            Σελίδα {currentPage} από {totalPages} ({COINS_PER_PAGE} νομίσματα ανά σελίδα)
          </p>
        </div>

        {/* Coins Grid */}
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-12"
        >
          {currentCoins.map((coin, index) => (
            <div key={coin.id} className="w-full">
              <OptimizedCoinCard 
                coin={coin} 
                index={startIndex + index} 
                priority={index < 12} 
              />
            </div>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Προηγούμενη
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10 h-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2"
              >
                Επόμενη
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Load More Button */}
            {currentPage < totalPages && (
              <Button
                onClick={handleLoadMore}
                className="bg-electric-orange hover:bg-electric-orange/90 text-white"
              >
                Φόρτωση Περισσότερων ({Math.min(COINS_PER_PAGE, directSaleCoins.length - endIndex)} ακόμη)
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCoinsSection;
