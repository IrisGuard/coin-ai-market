import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Store, ArrowRight, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DealerStoreCard from '@/components/marketplace/DealerStoreCard';
import DealerAuthModal from '@/components/auth/DealerAuthModal';
import DealerUpgradeModal from '@/components/auth/DealerUpgradeModal';
import { usePageView } from '@/hooks/usePageView';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ActiveMarketplace = () => {
  usePageView();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, session } = useAuth();
  const { t } = useTranslation();

  const [showDealerAuth, setShowDealerAuth] = useState(false);
  const [showDealerUpgrade, setShowDealerUpgrade] = useState(false);
  const [search, setSearch] = useState('');

  const { data: dealers, isLoading: dealersLoading } = useDealerStores();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['dealer-stores'] });
    queryClient.invalidateQueries({ queryKey: ['store-coin-counts'] });
  }, [queryClient]);

  const handleOpenStore = () => {
    if (!user || !session) {
      setShowDealerAuth(true);
    } else if (user.user_metadata?.role === 'dealer') {
      navigate('/dealer-direct');
    } else {
      setShowDealerUpgrade(true);
    }
  };

  const { data: storeCounts = {} } = useQuery({
    queryKey: ['store-coin-counts'],
    queryFn: async () => {
      const { data: coins } = await supabase
        .from('coins')
        .select('user_id')
        .order('created_at', { ascending: false })
        .limit(2000);
      const counts: Record<string, number> = {};
      coins?.forEach((c) => {
        if (c.user_id) counts[c.user_id] = (counts[c.user_id] || 0) + 1;
      });
      return counts;
    },
  });

  const filteredDealers = (dealers || []).filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.profiles?.username?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <header className="relative border-b border-border overflow-hidden">
        <div className="pointer-events-none absolute -top-32 right-0 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-[120px]" />
        <div className="max-w-7xl mx-auto container-padding py-16">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-5 border-primary/30 text-primary">{t('marketplace.title', 'NovaCoin Marketplace')}</Badge>
            <h1 className="text-display font-semibold tracking-tight mb-4">
              {t('marketplace.subtitle', 'Browse verified dealer storefronts and live listings.')}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mb-8">
              Discover verified storefronts curated by collectors and professional dealers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores, dealers, regions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-12 bg-card border-border"
                />
              </div>
              <Button onClick={handleOpenStore} size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Store className="w-4 h-4 mr-2" /> {t('marketplace.openStore', 'Open your store')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto container-padding py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-h1 font-semibold">{t('marketplace.allStores', 'All stores')}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredDealers.length} {t('marketplace.storesOnline', 'stores online')}
            </p>
          </div>
          <Link to="/" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            Back to home <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {dealersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl animate-shimmer" />
            ))}
          </div>
        ) : filteredDealers.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-20 text-center">
              <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-1">{t('marketplace.noStores', 'No stores yet')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('marketplace.noStoresDesc', 'Stores from verified dealers will appear here.')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDealers.map((dealer) => {
              const profile = dealer.profiles;
              return (
                <DealerStoreCard
                  key={dealer.id}
                  id={dealer.id}
                  avatar_url={profile?.avatar_url || dealer.logo_url}
                  username={profile?.username}
                  full_name={profile?.full_name}
                  bio={profile?.bio}
                  rating={profile?.rating}
                  location={profile?.location}
                  verified_dealer={profile?.role === 'admin' || dealer.verified}
                  totalCoins={storeCounts[dealer.user_id] || 0}
                  storeName={dealer.name}
                  storeDescription={dealer.description}
                  storeAddress={dealer.address}
                  created_at={dealer.created_at}
                />
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      <DealerAuthModal isOpen={showDealerAuth} onClose={() => setShowDealerAuth(false)} />
      <DealerUpgradeModal isOpen={showDealerUpgrade} onClose={() => setShowDealerUpgrade(false)} />
    </div>
  );
};

export default ActiveMarketplace;
