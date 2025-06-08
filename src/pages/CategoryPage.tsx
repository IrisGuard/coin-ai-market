
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import NavigationBreadcrumb from '@/components/navigation/NavigationBreadcrumb';
import BackButton from '@/components/navigation/BackButton';
import CategoryHeader from '@/components/categories/CategoryHeader';
import CategoryStats from '@/components/categories/CategoryStats';
import CategoryFilters from '@/components/categories/CategoryFilters';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import { useCategoryData } from '@/hooks/useCategoryData';
import { Loader2, Coins } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // REDIRECT FIX: If accessing auctions category, redirect to auctions page
  useEffect(() => {
    if (category === 'auctions') {
      navigate('/auctions', { replace: true });
      return;
    }
  }, [category, navigate]);

  const {
    coins,
    categoryStats,
    filters,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
    viewMode,
    setViewMode,
    isLoading
  } = useCategoryData(category || '');

  const getCategoryTitle = (cat: string) => {
    const titles: { [key: string]: string } = {
      'ancient': 'Αρχαία Νομίσματα',
      'modern': 'Μοντέρνα Νομίσματα', 
      'error': 'Error Νομίσματα',
      'graded': 'Graded Νομίσματα',
      'trending': 'Trending Νομίσματα',
      'european': 'Ευρωπαϊκά Νομίσματα',
      'american': 'Αμερικανικά Νομίσματα',
      'asian': 'Ασιατικά Νομίσματα',
      'gold': 'Χρυσά Νομίσματα',
      'silver': 'Ασημένια Νομίσματα',
      'rare': 'Σπάνια Νομίσματα'
    };
    return titles[cat] || 'Κατηγορία';
  };

  const getCategoryDescription = (cat: string) => {
    const descriptions: { [key: string]: string } = {
      'ancient': 'Ανακαλύψτε μεγαλοπρεπή νομίσματα από αρχαίους πολιτισμούς, αυτοκρατορίες και ιστορικές περιόδους. Κάθε κομμάτι αφηγείται μια ιστορία από παρελθούσες εποχές και αρχαία τεχνουργία.',
      'modern': 'Εξερευνήστε σύγχρονα νομίσματα από τη μοντέρνα εποχή (1900 και μετά), με ενημερωμένα σχέδια, προηγμένες τεχνικές κοπής και σύγχρονα θέματα.',
      'error': 'Βρείτε σπάνια error νομίσματα και λάθη κοπής που εκτιμώνται ιδιαίτερα από συλλέκτες. Αυτά τα μοναδικά κομμάτια αντιπροσωπεύουν συναρπαστικές ανωμαλίες παραγωγής.',
      'graded': 'Περιηγηθείτε σε επαγγελματικά βαθμολογημένα νομίσματα πιστοποιημένα από PCGS, NGC και άλλες κορυφαίες υπηρεσίες βαθμολόγησης με πιστοποιημένη ποιότητα και κατάσταση.',
      'trending': 'Δημοφιλή νομίσματα που τείνουν αυτή τη στιγμή με συλλέκτες παγκοσμίως. Μείνετε μπροστά από τις κινήσεις της αγοράς και τις προτιμήσεις των συλλεκτών.',
      'european': 'Ευρωπαϊκά νομίσματα από διάφορες χώρες και χρονικές περιόδους, παρουσιάζοντας την πλούσια νομισματική κληρονομιά της ευρωπαϊκής ηπείρου.',
      'american': 'Νομίσματα από τις Ηνωμένες Πολιτείες, τον Καναδά και το Μεξικό, αντιπροσωπεύοντας τις διαφορετικές νομισματικές παραδόσεις της Βόρειας Αμερικής.',
      'asian': 'Ασιατικά νομίσματα από την Κίνα, την Ιαπωνία, την Ινδία, την Κορέα και άλλες χώρες, με μοναδικά σχέδια και πολιτισμική σημασία.',
      'gold': 'Νομίσματα πολύτιμων μετάλλων που περιέχουν χρυσό σε διάφορες καθαρότητες. Αυτά τα κομμάτια συνδυάζουν νομισματική αξία με περιεχόμενο πολύτιμου μετάλλου.',
      'silver': 'Ασημένια νομίσματα και συλλεκτικά πολύτιμων μετάλλων με εγγενή αξία και νομισματική έλξη από διάφορα νομισματοκοπεία παγκοσμίως.',
      'rare': 'Εξαιρετικά σπάνια και πολύτιμα νομίσματα για σοβαρούς συλλέκτες, με χαμηλές κυκλοφορίες, ιστορική σημασία ή μοναδικά χαρακτηριστικά.'
    };
    return descriptions[cat] || 'Περιηγηθείτε σε αυτή την ειδικευμένη κατηγορία νομισμάτων.';
  };

  if (!category || category === 'auctions') {
    return null; // Will redirect
  }

  const categoryTitle = getCategoryTitle(category);
  const categoryDescription = getCategoryDescription(category);

  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <NavigationBreadcrumb />
        
        <div className="pt-4">
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <BackButton to="/marketplace" label="Πίσω στο Marketplace" />
          </div>

          <CategoryHeader
            category={category}
            title={categoryTitle}
            description={categoryDescription}
            coinCount={categoryStats.totalCoins}
            isLoading={isLoading}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CategoryStats
              category={category}
              totalCoins={categoryStats.totalCoins}
              averagePrice={categoryStats.averagePrice}
              priceRange={categoryStats.priceRange}
              mostExpensive={categoryStats.mostExpensive}
              oldestCoin={categoryStats.oldestCoin}
              newestCoin={categoryStats.newestCoin}
              totalAuctions={categoryStats.totalAuctions}
              featuredCount={categoryStats.featuredCount}
            />

            <CategoryFilters
              category={category}
              searchTerm={filters.searchTerm}
              setSearchTerm={(value) => updateFilter('searchTerm', value)}
              sortBy={filters.sortBy}
              setSortBy={(value) => updateFilter('sortBy', value)}
              priceRange={filters.priceRange}
              setPriceRange={(value) => updateFilter('priceRange', value)}
              yearRange={filters.yearRange}
              setYearRange={(value) => updateFilter('yearRange', value)}
              selectedCountry={filters.selectedCountry}
              setSelectedCountry={(value) => updateFilter('selectedCountry', value)}
              selectedCondition={filters.selectedCondition}
              setSelectedCondition={(value) => updateFilter('selectedCondition', value)}
              selectedRarity={filters.selectedRarity}
              setSelectedRarity={(value) => updateFilter('selectedRarity', value)}
              showAuctionsOnly={filters.showAuctionsOnly}
              setShowAuctionsOnly={(value) => updateFilter('showAuctionsOnly', value)}
              showFeaturedOnly={filters.showFeaturedOnly}
              setShowFeaturedOnly={(value) => updateFilter('showFeaturedOnly', value)}
              viewMode={viewMode}
              setViewMode={setViewMode}
              clearAllFilters={clearAllFilters}
              activeFiltersCount={activeFiltersCount}
            />

            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
                  <span className="text-electric-blue">Φόρτωση {categoryTitle.toLowerCase()}...</span>
                </div>
              </div>
            ) : (
              <>
                {coins.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={viewMode === 'grid' 
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                      : "space-y-4"
                    }
                  >
                    {coins.map((coin, index) => (
                      <motion.div
                        key={coin.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="w-full"
                      >
                        <OptimizedCoinCard 
                          coin={coin} 
                          index={index} 
                          priority={index < 12}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16"
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Coins className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Δεν βρέθηκαν νομίσματα</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Δεν υπάρχουν νομίσματα που να ταιριάζουν με τα τρέχοντα κριτήρια φίλτρου σε αυτή την κατηγορία.
                      </p>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-electric-blue hover:text-electric-purple font-medium text-sm"
                        >
                          Εκκαθάριση όλων των φίλτρων για να δείτε περισσότερα αποτελέσματα
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default CategoryPage;
