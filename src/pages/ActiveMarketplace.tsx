
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, TrendingUp, Star, Clock, Shield, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCoins } from '@/hooks/useCoins';
import { useMarketplaceState } from '@/hooks/useMarketplaceState';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import TransakPayment from '@/components/payment/TransakPayment';
import QuickActionsSection from '@/components/QuickActionsSection';
import ServicesSection from '@/components/ServicesSection';
import FeatureSection from '@/components/FeatureSection';
import TrustIndicators from '@/components/showcase/TrustIndicators';

const ActiveMarketplace = () => {
  const { user } = useAuth();
  const {
    enhancedCoins,
    coinsLoading,
    viewMode,
    setViewMode,
    filters,
    updateFilter,
    clearFilters,
    enhancedStats
  } = useMarketplaceState();

  const [selectedCoin, setSelectedCoin] = React.useState<any>(null);
  const [showPayment, setShowPayment] = React.useState(false);

  const handlePurchase = (coin: any) => {
    if (!user) {
      // Redirect to auth
      return;
    }
    setSelectedCoin(coin);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedCoin(null);
    // Refresh data or show success message
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-electric-blue/5 to-electric-purple/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-3 bg-bg-primary/80 backdrop-blur-sm rounded-full border border-border-accent mb-6">
            <TrendingUp className="w-5 h-5 mr-3 text-brand-primary" />
            <span className="text-sm font-semibold text-brand-primary">Live Marketplace</span>
            <Star className="w-4 h-4 ml-3 text-brand-yellow" />
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-brand-primary via-electric-purple to-electric-indigo bg-clip-text text-transparent mb-6">
            CoinVision Marketplace
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Ανακαλύψτε και αγοράστε αυθεντικά νομίσματα από επαληθευμένους συλλέκτες παγκοσμίως
          </p>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <Card className="bg-bg-primary/80 backdrop-blur-sm border-border-accent">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-primary">{enhancedStats.total}</div>
              <div className="text-sm text-text-secondary">Ενεργά Νομίσματα</div>
            </CardContent>
          </Card>
          <Card className="bg-bg-primary/80 backdrop-blur-sm border-electric-purple/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-electric-purple">{enhancedStats.auctions}</div>
              <div className="text-sm text-text-secondary">Ζωντανές Δημοπρασίες</div>
            </CardContent>
          </Card>
          <Card className="bg-bg-primary/80 backdrop-blur-sm border-brand-success/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-success">{enhancedStats.featured}</div>
              <div className="text-sm text-text-secondary">Προτεινόμενα</div>
            </CardContent>
          </Card>
          <Card className="bg-bg-primary/80 backdrop-blur-sm border-electric-indigo/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-electric-indigo">
                €{(enhancedStats.totalValue / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-text-secondary">Συνολική Αξία</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-primary/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-border-primary shadow-xl"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
            <Input
              placeholder="Αναζήτηση νομισμάτων, χρονολογιών, χωρών..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-12 h-14 text-lg bg-bg-primary/50 border-border-secondary focus:border-brand-primary"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              variant={filters.showAuctionsOnly ? "default" : "outline"}
              onClick={() => updateFilter('showAuctionsOnly', !filters.showAuctionsOnly)}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Δημοπρασίες ({enhancedStats.auctions})
            </Button>
            <Button
              variant={filters.showFeaturedOnly ? "default" : "outline"}
              onClick={() => updateFilter('showFeaturedOnly', !filters.showFeaturedOnly)}
              className="flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Προτεινόμενα ({enhancedStats.featured})
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-text-secondary"
            >
              Καθαρισμός Φίλτρων
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Εμφάνιση {enhancedCoins.length} νομισμάτων
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Coins Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {coinsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-bg-secondary rounded-lg mb-4"></div>
                    <div className="h-4 bg-bg-secondary rounded mb-2"></div>
                    <div className="h-6 bg-bg-secondary rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : enhancedCoins.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {enhancedCoins.map((coin, index) => (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-300 bg-bg-primary/90 backdrop-blur-sm border-border-primary/50 overflow-hidden">
                    <div className="relative">
                      <div className="aspect-square overflow-hidden bg-bg-secondary">
                        <img
                          src={coin.image || '/placeholder-coin.png'}
                          alt={coin.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      
                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {coin.featured && (
                          <Badge className="bg-brand-yellow text-text-primary">
                            <Star className="w-3 h-3 mr-1" />
                            Προτεινόμενο
                          </Badge>
                        )}
                        {coin.is_auction && (
                          <Badge className="bg-brand-primary text-bg-primary">
                            <Clock className="w-3 h-3 mr-1" />
                            Δημοπρασία
                          </Badge>
                        )}
                      </div>

                      {/* Authentication Badge */}
                      {coin.authentication_status === 'verified' && (
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-brand-success text-bg-primary">
                            <Shield className="w-3 h-3 mr-1" />
                            Επαληθευμένο
                          </Badge>
                        </div>
                      )}

                      {/* Favorite Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 bg-bg-primary/80 hover:bg-bg-primary"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Title */}
                        <div>
                          <h3 className="font-semibold text-lg text-text-primary line-clamp-1">
                            {coin.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                            <span>{coin.year}</span>
                            {coin.country && (
                              <>
                                <span>•</span>
                                <span>{coin.country}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2 flex-wrap">
                          {coin.rarity && (
                            <Badge variant="outline" className="text-xs border-border-secondary text-text-secondary">
                              {coin.rarity}
                            </Badge>
                          )}
                          {coin.condition && (
                            <Badge variant="outline" className="text-xs border-border-secondary text-text-secondary">
                              {coin.condition}
                            </Badge>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-text-primary">
                              €{coin.price?.toLocaleString()}
                            </div>
                            {coin.is_auction && (
                              <div className="text-sm text-text-secondary">Τρέχουσα προσφορά</div>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-text-muted pt-2 border-t border-border-primary">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {coin.views || 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {coin.favorites || 0}
                            </div>
                          </div>
                          
                          {coin.profiles?.verified_dealer && (
                            <Badge variant="outline" className="text-xs border-border-secondary text-text-secondary">
                              <Shield className="w-3 h-3 mr-1" />
                              Επαληθευμένος
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Link to={`/coin/${coin.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              Προβολή
                            </Button>
                          </Link>
                          {!coin.is_auction && !coin.sold && (
                            <Button 
                              onClick={() => handlePurchase(coin)}
                              className="flex-1 bg-gradient-to-r from-brand-primary to-electric-purple hover:from-brand-primary/90 hover:to-electric-purple/90 text-bg-primary"
                            >
                              Αγορά Τώρα
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-text-muted" />
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-2">
                  Δεν βρέθηκαν νομίσματα
                </h3>
                <p className="text-text-secondary mb-6">
                  Δοκιμάστε να αλλάξετε τα κριτήρια αναζήτησής σας
                </p>
                <Button onClick={clearFilters}>
                  Καθαρισμός Φίλτρων
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Payment Modal */}
        {showPayment && selectedCoin && (
          <div className="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-primary rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Ασφαλής Πληρωμή</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowPayment(false)}
                  className="p-2"
                >
                  ×
                </Button>
              </div>
              
              <TransakPayment
                coinId={selectedCoin.id}
                coinName={selectedCoin.name}
                price={selectedCoin.price}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        )}
      </div>

      {/* Additional Marketplace Features */}
      <div className="bg-bg-secondary border-t border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <QuickActionsSection />
          <ServicesSection />
          <FeatureSection />
        </div>
      </div>

      <TrustIndicators />
      <Footer />
    </div>
  );
};

export default ActiveMarketplace;
